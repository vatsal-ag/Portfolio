import os
import json
from sqlmodel import SQLModel, create_engine, Session, select
from app.models import PatientProfile, MealRoutine, OngoingMedication, LabReport

DB_FILE = "prescription_app.db"
DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}
)

def init_db():
    SQLModel.metadata.create_all(engine)
    # Seed initial default profile if not present
    with Session(engine, expire_on_commit=False) as session:
        profile = session.get(PatientProfile, 1)
        if not profile:
            profile = PatientProfile(
                id=1,
                full_name="Grandpa Arthur Vance",
                age=74,
                gender="Male",
                chronic_conditions_json='["Type 2 Diabetes", "Chronic Acid Reflux (GERD)", "Mild Knee Osteoarthritis"]',
                allergies_json='["Penicillin"]',
                emergency_contact_name="Sarah Vance (Daughter)",
                emergency_contact_phone="+1 (555) 789-0142",
                nominee_name="Sarah Vance",
                nominee_relationship="Daughter / Primary Caregiver",
                nominee_phone="+1 (555) 789-0142",
                nominee_email="sarah.vance@familycare.org",
                compassionate_disclosure_mode=True,
                nominee_pin="1234"
            )
            session.add(profile)
            
            # Default meal routine for elderly caretaker
            routine = MealRoutine(
                id=1,
                patient_id=1,
                wake_time="07:00",
                breakfast_time="08:30",
                lunch_time="13:00",
                evening_snack_time="17:00",
                dinner_time="20:00",
                bedtime="22:00",
                notes="Requires medicines with lukewarm water. Digestion is sensitive in the morning."
            )
            session.add(routine)

            # Ongoing daily medications for the patient
            ongoing_meds = [
                OngoingMedication(
                    patient_id=1,
                    name="Metformin 500mg",
                    generic_name="Metformin Hydrochloride",
                    dosage="500 mg",
                    frequency="Twice daily",
                    timing_relation="after_breakfast_dinner",
                    purpose="Controls blood sugar levels for Type 2 Diabetes"
                ),
                OngoingMedication(
                    patient_id=1,
                    name="Amlodipine 5mg",
                    generic_name="Amlodipine Besylate",
                    dosage="5 mg",
                    frequency="Once daily in the morning",
                    timing_relation="after_breakfast",
                    purpose="Maintains stable blood pressure"
                )
            ]
            for m in ongoing_meds:
                session.add(m)

            session.commit()

        # Seed initial sample lab reports if none exist
        existing_report = session.exec(select(LabReport).where(LabReport.patient_id == 1)).first()
        if not existing_report:
            sample_reports = [
                LabReport(
                    patient_id=1,
                    report_title="Comprehensive Renal & Metabolic Panel (KFT / LFT)",
                    report_type="Biochemistry / Blood Test",
                    report_date="2026-09-18",
                    lab_name="Apollo Diagnostics Reference Lab",
                    doctor_referred="Dr. Robert Miller, MD (Orthopedics)",
                    summary_findings="Serum Creatinine is mildly elevated (1.38 mg/dL) with borderline eGFR (56 mL/min). Liver transaminases and electrolytes are within normal limits.",
                    parameters_json=json.dumps([
                        {"parameter": "Serum Creatinine", "value": "1.38", "unit": "mg/dL", "reference": "0.7 - 1.2", "status": "HIGH"},
                        {"parameter": "eGFR (Glomerular Filtration)", "value": "56", "unit": "mL/min/1.73m²", "reference": "> 60", "status": "LOW"},
                        {"parameter": "Blood Urea Nitrogen (BUN)", "value": "22", "unit": "mg/dL", "reference": "7 - 20", "status": "HIGH"},
                        {"parameter": "Serum Potassium", "value": "4.4", "unit": "mEq/L", "reference": "3.5 - 5.1", "status": "NORMAL"},
                        {"parameter": "SGOT (AST)", "value": "28", "unit": "U/L", "reference": "10 - 40", "status": "NORMAL"},
                        {"parameter": "SGPT (ALT)", "value": "32", "unit": "U/L", "reference": "10 - 45", "status": "NORMAL"}
                    ]),
                    clinical_correlation="⚠️ Medication Precaution: Mild renal clearance reduction (Creatinine 1.38) indicates caution with NSAID painkillers (Combiflam). Stay thoroughly hydrated (min 2.5L/day) and limit NSAID course to 5 days."
                ),
                LabReport(
                    patient_id=1,
                    report_title="Glycemic Control Panel (HbA1c & Fasting Glucose)",
                    report_type="Diabetes Monitoring",
                    report_date="2026-09-12",
                    lab_name="Quest Diagnostics Clinical Laboratory",
                    doctor_referred="Dr. S. Sharma, MD",
                    summary_findings="HbA1c stands at 7.4% reflecting fair long-term glycemic control under ongoing Metformin 500mg daily. Fasting blood sugar is 134 mg/dL.",
                    parameters_json=json.dumps([
                        {"parameter": "HbA1c (Glycated Hemoglobin)", "value": "7.4", "unit": "%", "reference": "< 5.7 (Normal), < 7.0 (Target for Diabetics)", "status": "HIGH"},
                        {"parameter": "Estimated Average Glucose (eAG)", "value": "166", "unit": "mg/dL", "reference": "< 154", "status": "HIGH"},
                        {"parameter": "Fasting Blood Glucose", "value": "134", "unit": "mg/dL", "reference": "70 - 100", "status": "HIGH"}
                    ]),
                    clinical_correlation="🩺 Chronic Disease Interaction: Patient's HbA1c is 7.4%. Avoid high-potency corticosteroids (Prednisolone) without strict blood sugar monitoring to avoid acute diabetic hyperosmolar spikes."
                )
            ]
            for rep in sample_reports:
                session.add(rep)
            session.commit()

def get_session():
    with Session(engine, expire_on_commit=False) as session:
        yield session
