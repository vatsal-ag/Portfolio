export interface PatientProfile {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  chronic_conditions: string[];
  allergies: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  nominee_name?: string;
  nominee_relationship?: string;
  nominee_phone?: string;
  nominee_email?: string;
  compassionate_disclosure_mode?: boolean;
  nominee_pin?: string;
  hipaa_consent_signed: boolean;
  phi_encryption_enabled: boolean;
}

export interface OngoingMedication {
  id: number;
  patient_id: number;
  name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  timing_relation: string;
  purpose: string;
  is_active: boolean;
  created_at: string;
}

export interface ProofArticle {
  title: string;
  journal: string;
  year: string | number;
  pmid: string;
  doi?: string;
  study_type: string;
  key_finding: string;
  evidence_grade: string;
  url: string;
}

export interface PrescriptionMedicine {
  id?: number;
  prescription_id?: number;
  brand_name: string;
  generic_name: string;
  category: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  purpose: string;
  synergy_role?: string;
  timing_meal_relation: string;
  is_controlled_or_high_power?: boolean;
  potency_level?: string;
  potency_explanation?: string;
  lighter_alternative_name?: string;
  lighter_alternative_rationale?: string;
  proof_articles?: ProofArticle[];
}

export interface InteractionRecord {
  id?: number;
  prescription_id?: number;
  severity: 'CRITICAL' | 'MODERATE' | 'INFORMATIONAL' | 'SYNERGY';
  title: string;
  interaction_type: 'DRUG_CONDITION' | 'DRUG_DRUG' | 'SYNERGY_COUNTERACT' | 'HIGH_POTENCY_WARNING';
  medicines_involved: string;
  explanation: string;
  recommendation: string;
}

export interface Prescription {
  id: number;
  patient_id: number;
  title: string;
  prescription_date: string;
  doctor_name: string;
  clinic_or_hospital: string;
  diagnosis: string;
  image_filename?: string;
  raw_ocr_text?: string;
  notes?: string;
  is_severe_diagnosis?: boolean;
  severity_tier?: string;
  compassionate_summary?: string;
  nominee_review_required?: boolean;
  nominee_reviewed?: boolean;
  nominee_review_notes?: string;
  nominee_reviewed_at?: string;
  phi_redacted: boolean;
  created_at: string;
}

export interface PrescriptionDetail {
  prescription: Prescription;
  medicines: PrescriptionMedicine[];
  interactions: InteractionRecord[];
  alarms?: MedicationAlarm[];
}

export interface MealRoutine {
  id: number;
  patient_id: number;
  wake_time: string;
  breakfast_time: string;
  lunch_time: string;
  evening_snack_time: string;
  dinner_time: string;
  bedtime: string;
  notes?: string;
}

export interface MedicationAlarm {
  id: number;
  patient_id: number;
  prescription_id?: number;
  medicine_name: string;
  dosage: string;
  scheduled_time: string;
  meal_context: string;
  instructions: string;
  status: 'PENDING' | 'TAKEN' | 'SNOOZED' | 'MISSED';
  is_active: boolean;
  taken_at?: string;
}

export interface LabParameter {
  parameter: string;
  value: string;
  unit: string;
  reference: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface LabReport {
  id: number;
  patient_id: number;
  report_title: string;
  report_type: string;
  report_date: string;
  lab_name?: string;
  doctor_referred?: string;
  file_url?: string;
  summary_findings: string;
  parameters: LabParameter[];
  clinical_correlation?: string;
  created_at?: string;
}

export interface DietMeal {
  meal: string;
  time: string;
  menu: string;
  therapeutic_reason: string;
  prescription_sync: string;
}

export interface HealingFood {
  food: string;
  benefits: string;
  badge: string;
}

export interface AvoidFood {
  food: string;
  danger: string;
  severity: string;
}

export interface DietPlan {
  diet_title: string;
  patient_name: string;
  conditions_addressed: string[];
  meals: DietMeal[];
  healing_foods: HealingFood[];
  avoid_foods: AvoidFood[];
  hydration: {
    daily_target_liters: number;
    recommended_beverages: string[];
    timing_rule: string;
  };
  acute_tips: string[];
  clinical_disclaimer: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  actor: string;
  action_type: string;
  resource_id?: string;
  details: string;
  ip_address?: string;
}

export interface ComplianceStatus {
  status: string;
  compliance_score: number;
  standards: {
    name: string;
    status: string;
    controls: string;
  }[];
  safeguards: {
    encryption_at_rest: string;
    audit_logging: string;
    caretaker_authorization: string;
    data_portability: string;
  };
}
