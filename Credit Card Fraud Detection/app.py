import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, render_template
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import os

app = Flask(__name__)

# Global variables to store the trained model and scaler (Unit 2 concept)
model = None
scaler = None

def train_model():
    """
    Trains the Logistic Regression model using creditcard.csv.
    Follows logic from AIML Experiment 6 and 7.
    """
    global model, scaler

    if not os.path.exists("creditcard.csv"):
        print("CRITICAL ERROR: creditcard.csv not found.")
        return

    print("Loading dataset for training...")
    # CO5: Data Manipulation using Pandas
    df = pd.read_csv("creditcard.csv")

    df.dropna(inplace=True)

    # Separate Features (X) and Target (y)
    X = df.drop("Class", axis=1)
    y = df["Class"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_scaled, y)
    print("Model trained and ready for dashboard calls!")

@app.route("/")
def index():
    """Serves the dashboard HTML file."""
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Receives CSV from the dashboard, processes it, and returns results.
    Matches the 'fetch' call in your HTML.
    """
    if model is None:
        return jsonify({"error": "Model not trained yet."}), 500

    # Retrieve the file from the request 
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded."}), 400

    try:
        # Load and process the test data using Pandas
        df_test = pd.read_csv(file)
        
        # Remove 'Class' if it exists in the test file to isolate features
        X_input = df_test.drop("Class", axis=1) if "Class" in df_test.columns else df_test

        # Apply scaling using the fitted scaler
        X_test_scaled = scaler.transform(X_input)

        # Get binary predictions and raw probabilities
        predictions = model.predict(X_test_scaled)
        
        # Calculate summary statistics for the dashboard
        total_tx = len(predictions)
        fraud_tx = int(np.sum(predictions)) # Sum of 1s (fraud)

        # Return results as JSON for the JavaScript in index.html
        return jsonify({
            "summary": {
                "total": total_tx,
                "fraud_count": fraud_tx,
                "normal_count": total_tx - fraud_tx
            },
            "status": "Success"
        })

    except Exception as e:
        return jsonify({"error": f"Internal Error: {str(e)}"}), 500

if __name__ == "__main__":
    # Start the training and then the local server
    train_model()
    app.run(debug=True)