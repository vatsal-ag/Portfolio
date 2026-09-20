from datetime import datetime, date
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field
import json

class PatientProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(default="Senior Patient")
    age: int = Field(default=74)
    gender: str = Field(default="Male")
    # Stored as JSON strings: ["Type 2 Diabetes", "Chronic Acid Reflux/GERD", "Hypertension"]
    chronic_conditions_json: str = Field(default="[\"Type 2 Diabetes\", \"Chronic Acid Reflux (GERD)\", \"Mild Knee Osteoarthritis\"]")
    # Stored as JSON strings: ["Penicillin", "Sulfa drugs"]
    allergies_json: str = Field(default="[\"Penicillin\"]")
    emergency_contact_name: str = Field(default="Sarah Vance (Daughter)")
    emergency_contact_phone: str = Field(default="+1 (555) 789-0142")
    hipaa_consent_signed: bool = Field(default=True)
    phi_encryption_enabled: bool = Field(default=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def chronic_conditions(self) -> List[str]:
        try:
            return json.loads(self.chronic_conditions_json)
        except Exception:
            return []

    @chronic_conditions.setter
    def chronic_conditions(self, value: List[str]):
        self.chronic_conditions_json = json.dumps(value)

    @property
    def allergies(self) -> List[str]:
        try:
            return json.loads(self.allergies_json)
        except Exception:
            return []

    @allergies.setter
    def allergies(self, value: List[str]):
        self.allergies_json = json.dumps(value)


class OngoingMedication(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(default=1, index=True)
    name: str  # e.g., "Metformin 500mg"
    generic_name: str  # e.g., "Metformin Hydrochloride"
    dosage: str  # e.g., "500 mg"
    frequency: str  # e.g., "Twice daily after meals"
    timing_relation: str = Field(default="after_breakfast_dinner")  # relation to meals
    purpose: str  # e.g., "Controls blood glucose level for Type 2 Diabetes"
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Prescription(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(default=1, index=True)
    title: str = Field(default="Doctor Consultation")
    prescription_date: Optional[str] = Field(default=None)  # e.g., "2026-09-15"
    doctor_name: Optional[str] = Field(default=None)  # e.g., "Dr. S. Sharma, MD (Ortho)"
    clinic_or_hospital: Optional[str] = Field(default=None)
    diagnosis: Optional[str] = Field(default=None)  # e.g., "Acute Knee Joint Arthritis"
    image_filename: Optional[str] = Field(default=None)
    raw_ocr_text: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)
    # HIPAA audit & de-identification tag
    phi_redacted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PrescriptionMedicine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    prescription_id: int = Field(index=True)
    brand_name: str  # e.g., "Combiflam" or "Voveran SR"
    generic_name: str  # e.g., "Ibuprofen + Paracetamol" or "Diclofenac Sodium"
    category: str = Field(default="Medication")  # e.g., "NSAID / Painkiller", "Antacid / PPI"
    dosage: str  # e.g., "50mg" or "1 tablet"
    frequency: str  # e.g., "BD (Twice a day)" or "TDS"
    duration: str = Field(default="5 days")
    instructions: str  # e.g., "Take after breakfast and dinner"
    purpose: str  # What the medicine is used for in plain language
    synergy_role: Optional[str] = None  # e.g., "Prescribed to counteract stomach acid caused by the painkiller"
    timing_meal_relation: str = Field(default="after_meal")  # before_breakfast, after_breakfast, after_lunch, after_dinner, bedtime, etc.


class InteractionRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    prescription_id: int = Field(index=True)
    severity: str  # "CRITICAL", "MODERATE", "INFORMATIONAL", "SYNERGY"
    title: str  # e.g., "Potential Stomach Lining Irritation" or "Beneficial Synergy Detected"
    interaction_type: str  # "DRUG_CONDITION", "DRUG_DRUG", "SYNERGY_COUNTERACT"
    medicines_involved: str  # e.g., "Diclofenac + Pantoprazole" or "Ibuprofen with Stomach Ulcers"
    explanation: str  # Clinical explanation in warm, patient-friendly phrasing
    recommendation: str  # Actionable advice, e.g. "Do not skip the antacid; take strictly after meals."


class MealRoutine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(default=1, index=True)
    wake_time: str = Field(default="07:00")
    breakfast_time: str = Field(default="08:30")
    lunch_time: str = Field(default="13:00")
    evening_snack_time: str = Field(default="17:00")
    dinner_time: str = Field(default="20:00")
    bedtime: str = Field(default="22:00")
    notes: Optional[str] = Field(default="Prefers light warm meals with water")
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class MedicationAlarm(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(default=1, index=True)
    prescription_id: Optional[int] = Field(default=None, index=True)
    medicine_name: str
    dosage: str
    scheduled_time: str  # e.g., "09:00"
    meal_context: str  # e.g., "30 mins after Breakfast"
    instructions: str
    status: str = Field(default="PENDING")  # PENDING, TAKEN, SNOOZED, MISSED
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    taken_at: Optional[datetime] = None


# HIPAA & IT ACT COMPLIANCE MODELS
class AuditLog(SQLModel, table=True):
    """Immutable access and activity log compliant with HIPAA Security Rule 45 CFR § 164.312(b)."""
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    actor: str = Field(default="Patient")  # Patient, Caregiver, System, Auditor
    action_type: str  # PRESCRIPTION_SCAN, RECORD_ACCESS, PROFILE_UPDATE, EXPORT_EHR, PURGE_PHI
    resource_id: Optional[str] = None
    details: str
    ip_address: Optional[str] = Field(default="127.0.0.1 (Local device)")


class ConsentRecord(SQLModel, table=True):
    """Electronic consent tracking under IT Act 2000 & HIPAA Privacy Rule."""
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(default=1, index=True)
    consent_title: str
    consent_type: str  # HIPAA_NOTICE, AI_VISION_OCR_PROCESSING, CAREGIVER_ALARM_AUTHORIZATION
    status: str = Field(default="ACTIVE")  # ACTIVE, REVOKED
    signed_at: datetime = Field(default_factory=datetime.utcnow)
    terms_version: str = Field(default="v2026.1-HIPAA")
    legal_description: str
