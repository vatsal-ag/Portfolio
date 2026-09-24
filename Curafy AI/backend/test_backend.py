import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

init_db()
client = TestClient(app)

def test_full_pipeline():
    # 1. Test profile retrieval
    res = client.get("/api/patient/profile")
    assert res.status_code == 200, res.text
    profile = res.json()
    print("Patient Profile:", profile["full_name"], "Conditions:", profile["chronic_conditions"])
    assert "Type 2 Diabetes" in profile["chronic_conditions"]

    # 2. Test sample prescription load (Painkiller + Antacid Synergy)
    res = client.post("/api/prescriptions/load-sample/sample-painkiller-synergy")
    assert res.status_code == 200, res.text
    data = res.json()
    print("Prescription Loaded:", data["prescription"]["title"])
    assert len(data["medicines"]) >= 3
    
    # Check Synergies
    synergies = [i for i in data["interactions"] if i["severity"] == "SYNERGY"]
    print("Synergies Detected:", len(synergies))
    for s in synergies:
        print(f"  + [{s['severity']}] {s['title']}: {s['explanation']}")
    assert len(synergies) >= 1
    assert "Combiflam" in synergies[0]["medicines_involved"]

    # Check Contraindications against patient's chronic Acid Reflux / GERD
    contraindications = [i for i in data["interactions"] if i["severity"] == "CRITICAL"]
    print("Contraindications Flagged:", len(contraindications))
    for c in contraindications:
        print(f"  ! [{c['severity']}] {c['title']}: {c['recommendation']}")
    assert len(contraindications) >= 1

    # 3. Check Elderly Caretaker Alarms
    res = client.get("/api/caretaker/alarms")
    assert res.status_code == 200
    alarms = res.json()
    print(f"Generated {len(alarms)} Meal-Aligned Alarms:")
    for a in alarms:
        print(f"  ⏰ {a['scheduled_time']} - {a['medicine_name']} ({a['meal_context']})")
    assert len(alarms) >= 3

    # 4. Check HIPAA Audit Logs
    res = client.get("/api/hipaa/audit-logs")
    assert res.status_code == 200
    logs = res.json()
    print(f"Audit Trail Entries: {len(logs)} entries logged.")
    assert len(logs) >= 2

    # 5. Check HIPAA Compliance Status
    res = client.get("/api/hipaa/compliance-status")
    assert res.status_code == 200
    status = res.json()
    assert status["status"] == "COMPLIANT"
    print("HIPAA & IT Act Compliance Status:", status["status"], f"Score: {status['compliance_score']}%")

    print("\nALL BACKEND AUTOMATED TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_pipeline()

def test_packaging_verification():
    print("\n--- Testing Medicine Packaging & Substitute Verification ---")
    res = client.get("/api/prescriptions/verify-sample/sample-pan40-substitute")
    assert res.status_code == 200, res.text
    data = res.json()
    print("Prescribed:", data["prescribed"]["brand_name"])
    print("Detected in photo:", data["verification"]["detected_brand_name"])
    print("Verdict:", data["verification"]["match_status"])
    print("Explanation:", data["verification"]["patient_explanation"])
    assert data["verification"]["match_status"] == "GENERIC_EQUIVALENT"
    assert data["verification"]["is_safe_substitute"] is True
    print("Packaging Verification Test PASSED!\n")

if __name__ == "__main__":
    test_packaging_verification()
