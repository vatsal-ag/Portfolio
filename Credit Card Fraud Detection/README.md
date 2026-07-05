# Credit Card Fraud Detection

An AI/ML system that analyzes transaction data using Logistic Regression to detect fraudulent activity in real-time. Features a trained ML model and comprehensive data preprocessing.

## 💳 Key Modules

### 1. Model Training & Accuracy
* **The Challenge:** Fraudulent transactions make up a tiny fraction of total transactions, leading to heavily imbalanced datasets.
* **The Action:** Implemented data preprocessing using `Pandas` and `Scikit-Learn`'s `StandardScaler` to normalize features and train a robust `LogisticRegression` model.
* **The Result:** Achieved high accuracy in identifying fraudulent transactions while maintaining a low false-positive rate.

### 2. Real-Time Transaction Processing
* **The Challenge:** Batch processing of transactions delays fraud detection.
* **The Action:** Developed a real-time prediction pipeline that accepts live transaction vectors and scales them against the pre-trained distribution.
* **The Result:** Enables instantaneous flagging of suspicious activity for immediate intervention.

---

## Tech Stack & Logic
* **Language:** Python
* **Machine Learning:** Scikit-Learn
* **Data Processing:** Pandas, NumPy
* **Algorithm:** Logistic Regression

---

## 📂 Project Structure
* `Project.py` / `app.py`: Core prediction logic and data loading.
* `test_transactions.csv`: Sample data for testing predictions.
* *(Note: Massive training datasets omitted from repository for storage optimization)*
