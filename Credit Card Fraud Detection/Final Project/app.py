import pandas as pd
from flask import Flask, request, jsonify, render_template
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import os

app = Flask(__name__)

model = None
scaler = None
train_columns = None   # ✅ store training feature names

def train_model():
    global model, scaler, train_columns

    df = pd.read_csv("creditcard.csv")

    # Features & target
    X = df.drop("Class", axis=1)
    y = df["Class"]

    # Save column names
    train_columns = X.columns

    # Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Model
    model = LogisticRegression(class_weight='balanced', max_iter=1000)
    model.fit(X_scaled, y)

    print("Model trained successfully!")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        file = request.files["file"]
        df_test = pd.read_csv(file)

        # ✅ Handle missing Class column safely
        if "Class" in df_test.columns:
            df_test = df_test.drop("Class", axis=1)

        # ✅ Ensure same columns as training
        missing_cols = set(train_columns) - set(df_test.columns)
        if missing_cols:
            return jsonify({"error": f"Missing columns: {missing_cols}"})

        # Reorder columns to match training
        df_test = df_test[train_columns]

        # Scale
        X_scaled = scaler.transform(df_test)

        # Predict
        predictions = model.predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)[:, 1]

        results = []
        for i in range(len(df_test)):
            prob = float(probabilities[i])

            if prob >= 0.7:
                risk = "HIGH"
            elif prob >= 0.3:
                risk = "MEDIUM"
            else:
                risk = "LOW"

            results.append({
                "id": i + 1,
                "amount": float(df_test["Amount"].iloc[i]),
                "time": float(df_test["Time"].iloc[i]),
                "fraud_probability": round(prob * 100, 2),
                "prediction": int(predictions[i]),
                "risk": risk
            })

        summary = {
            "total": len(results),
            "fraud": int(sum(predictions)),
            "normal": len(results) - int(sum(predictions))
        }

        return jsonify({"summary": summary, "results": results})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    train_model()
    app.run(debug=True)