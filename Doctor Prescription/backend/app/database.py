import os
from sqlmodel import SQLModel, create_engine, Session
from app.models import PatientProfile, MealRoutine, OngoingMedication

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
                emergency_contact_phone="+1 (555) 789-0142"
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

def get_session():
    with Session(engine, expire_on_commit=False) as session:
        yield session
