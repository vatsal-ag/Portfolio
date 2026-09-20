import { 
  PatientProfile, 
  OngoingMedication, 
  Prescription, 
  PrescriptionMedicine, 
  InteractionRecord, 
  PrescriptionDetail, 
  MealRoutine, 
  MedicationAlarm, 
  AuditLog, 
  ComplianceStatus 
} from '../types';

const BASE_URL = '/api';

export const api = {
  // Patient Profile
  async getProfile(): Promise<PatientProfile> {
    const res = await fetch(`${BASE_URL}/patient/profile`);
    if (!res.ok) throw new Error('Failed to fetch patient profile');
    return res.json();
  },

  async updateProfile(data: Partial<PatientProfile>): Promise<PatientProfile> {
    const res = await fetch(`${BASE_URL}/patient/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const json = await res.json();
    return json.profile;
  },

  // Ongoing Medications
  async getOngoingMedications(): Promise<OngoingMedication[]> {
    const res = await fetch(`${BASE_URL}/patient/ongoing-medications`);
    if (!res.ok) throw new Error('Failed to fetch daily medications');
    return res.json();
  },

  async addOngoingMedication(data: Partial<OngoingMedication>): Promise<OngoingMedication> {
    const res = await fetch(`${BASE_URL}/patient/ongoing-medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add daily medication');
    return res.json();
  },

  async deleteOngoingMedication(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/patient/ongoing-medications/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete medication');
  },

  // Prescriptions
  async uploadPrescription(file: File, apiKey?: string): Promise<{
    success: boolean;
    prescription_id: number;
    ocr_source: string;
    ocr_note: string;
    prescription: Prescription;
    medicines: PrescriptionMedicine[];
    interactions: InteractionRecord[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (apiKey) formData.append('api_key', apiKey);
    formData.append('patient_id', '1');

    const res = await fetch(`${BASE_URL}/prescriptions/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload prescription');
    return res.json();
  },

  async loadSamplePrescription(sampleId: string): Promise<{
    success: boolean;
    prescription_id: number;
    prescription: Prescription;
    medicines: PrescriptionMedicine[];
    interactions: InteractionRecord[];
  }> {
    const res = await fetch(`${BASE_URL}/prescriptions/load-sample/${sampleId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to load sample prescription');
    return res.json();
  },

  async getPrescriptions(search?: string): Promise<PrescriptionDetail[]> {
    const url = search ? `${BASE_URL}/prescriptions?search=${encodeURIComponent(search)}` : `${BASE_URL}/prescriptions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch prescriptions archive');
    return res.json();
  },

  async getPrescriptionDetail(id: number): Promise<PrescriptionDetail> {
    const res = await fetch(`${BASE_URL}/prescriptions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch prescription details');
    return res.json();
  },

  async deletePrescription(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/prescriptions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete prescription');
  },

  // Elderly Caretaker Meal Routine & Alarms
  async getMealRoutine(): Promise<MealRoutine> {
    const res = await fetch(`${BASE_URL}/caretaker/meal-routine`);
    if (!res.ok) throw new Error('Failed to fetch meal routine');
    return res.json();
  },

  async updateMealRoutine(routine: Partial<MealRoutine>): Promise<MealRoutine> {
    const res = await fetch(`${BASE_URL}/caretaker/meal-routine`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routine)
    });
    if (!res.ok) throw new Error('Failed to update meal routine');
    const json = await res.json();
    return json.routine;
  },

  async getAlarms(): Promise<MedicationAlarm[]> {
    const res = await fetch(`${BASE_URL}/caretaker/alarms`);
    if (!res.ok) throw new Error('Failed to fetch alarms');
    return res.json();
  },

  async setAlarmAction(alarmId: number, action: 'TAKEN' | 'SNOOZED' | 'MISSED' | 'PENDING'): Promise<MedicationAlarm> {
    const res = await fetch(`${BASE_URL}/caretaker/alarms/${alarmId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    if (!res.ok) throw new Error('Failed to update alarm status');
    const json = await res.json();
    return json.alarm;
  },

  // HIPAA & IT Act Compliance Center
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${BASE_URL}/hipaa/audit-logs`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getComplianceStatus(): Promise<ComplianceStatus> {
    const res = await fetch(`${BASE_URL}/hipaa/compliance-status`);
    if (!res.ok) throw new Error('Failed to fetch compliance status');
    return res.json();
  },

  async exportEHR(): Promise<any> {
    const res = await fetch(`${BASE_URL}/hipaa/export-ehr`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to export EHR');
    return res.json();
  },

  async setApiKey(key: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/config/api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key })
    });
    return res.ok;
  },

  // Medicine Packaging Photo Verification
  async verifyMedicinePhoto(
    file: File,
    prescribed: { brand_name: string; generic_name?: string; dosage?: string },
    apiKey?: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prescribed_brand', prescribed.brand_name);
    if (prescribed.generic_name) formData.append('prescribed_generic', prescribed.generic_name);
    if (prescribed.dosage) formData.append('prescribed_dosage', prescribed.dosage);
    if (apiKey) formData.append('api_key', apiKey);

    const res = await fetch(`${BASE_URL}/prescriptions/verify-medicine-photo`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to verify medicine packaging photo');
    return res.json();
  },

  async getSampleMedicineVerification(sampleId: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/prescriptions/verify-sample/${sampleId}`);
    if (!res.ok) throw new Error('Failed to load sample verification');
    return res.json();
  }
};
