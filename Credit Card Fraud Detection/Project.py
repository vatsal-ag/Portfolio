import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, render_template
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import os

app = Flask(__name__)

# Global variables to hold our model and scaler once trained
model = None
scaler = None

def train_model():
    """
    Trains the model using the creditcard.csv dataset.
    This follows the workflow of your AIML Experiments 6 & 7.
    """
    global model, scaler

    # Ensure the dataset is present in the current directory
    if not os.path.exists("creditcard.csv"):
        print("CRITICAL: creditcard.csv not found. Please add it to the folder.")
        return

    print("Loading dataset for training...")
    # Load data using Pandas (as per your Exp 10) [cite: 3674]
    df = pd.read_csv("creditcard.csv")

    # X = Features (V1-V28, Amount, Time), y = Target (Class)
    X = df.drop("Class", axis=1)
    y = df["Class"]

    # Initialize and fit the StandardScaler (Experiment 7: Preprocessing) [cite: 3621]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train a Logistic Regression model
    print("Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_scaled, y)
    print("Model is ready and connected to the dashboard!")

@app.route("/")
def index():
    """Loads the HTML dashboard from the 'templates' folder."""
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Processes the uploaded CSV and returns results to the HTML dashboard.
    """
    if model is None:
        return jsonify({"error": "Model not trained. Check creditcard.csv."}), 500

    # Get the file from the dashboard upload
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded."}), 400

    try:
        # Read the test data [cite: 3674]
        df_test = pd.read_csv(file)
        
        # We only need the features for prediction
        # If 'Class' is in the file, we ignore it
        X_input = df_test.drop("Class", axis=1) if "Class" in df_test.columns else df_test

        # Scale the data using the training scaler (Experiment 7 logic)
        X_test_scaled = scaler.transform(X_input)

        # Get Predictions (0 or 1) and Probabilities (%)
        predictions = model.predict(X_test_scaled)
        probabilities = model.predict_proba(X_test_scaled)[:, 1]

        results = []
        for i in range(len(df_test)):
            prob = float(probabilities[i])
            
            # Logic to determine Risk Level for the dashboard
            if prob >= 0.7:
                risk = "HIGH"
            elif prob >= 0.3:
                risk = "MEDIUM"
            else:
                risk = "LOW"

            results.append({
                "transaction_id": i + 1,
                "amount": round(float(df_test["Amount"].iloc[i]), 2),
                "time": int(df_test["Time"].iloc[i]),
                "fraud_probability": round(prob * 100, 1),
                "prediction": int(predictions[i]),
                "risk_level": risk
            })

        # Summary statistics for the top cards of the dashboard
        summary = {
            "total": len(results),
            "fraud_count": int(sum(predictions)),
            "normal_count": len(results) - int(sum(predictions)),
        }

        return jsonify({"results": results, "summary": summary})

    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

if __name__ == "__main__":
    # 1. Train the model on startup
    train_model()
    # 2. Run the server on http://127.0.0.1:5000
    app.run(debug=True)