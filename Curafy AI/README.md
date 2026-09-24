# Curafy AI - Prescription Reader and Healthcare Intelligence System

Curafy AI is a full-stack healthcare web application designed to help patients and caregivers understand medical prescriptions. It digitizes doctor handwriting using vision AI, explains why medicines are prescribed together, warns about controlled or high-potency drugs while suggesting lighter alternatives, validates diagnostic lab reports, provides condition-specific diet routines, and protects vulnerable patients with a nominee-first compassionate disclosure protocol.

The system is built with local data custody and follows guidelines from HIPAA (45 CFR Section 164) and the Indian Information Technology Act 2000 (SPDI Rules).

---

## The Problem

Medical prescriptions are often difficult for patients to understand:
- Doctors' handwriting and Latin shorthand (such as OD, BD, TDS, AC, PC) are hard to read.
- Patients often do not know why multiple medicines are given together, leading them to skip protective medicines like antacids.
- High-potency or habit-forming medicines (such as opioids and strong steroids) are sometimes prescribed without explaining lighter alternatives.
- Serious diagnostic news (like cancer or terminal illness) is often delivered bluntly, causing panic and distress.
- Patients struggle to coordinate their daily meal routines with medicine timings, or verify whether chemist-substituted medicine boxes are correct.

---

## Core Features

### 1. Doctor Handwriting Deciphering
- Uses Google Gemini Vision AI to read cursive handwriting, medical symbols, dosages, and administration frequencies.
- Translates technical clinical language into simple terms that anyone can understand.

### 2. Medicine Synergy Intelligence
- Explains why specific medicines are prescribed together.
- For example, when a strong painkiller (such as Combiflam or Diclofenac) is prescribed, the system explains why an antacid (such as Pantoprazole) was added to protect the stomach lining against acid irritation.
- Similarly explains antibiotic and probiotic combinations to protect intestinal bacteria.

### 3. High-Power Drug Alerts and Lighter Alternatives
- Identifies controlled substances, opioids, and heavy steroids.
- Explains potential side effects, dependency risks, and organ load.
- Recommends safer, lighter step-down alternatives with clear clinical rationales for the patient to discuss with their doctor.

### 4. Peer-Reviewed Medical Proof Articles
- Each prescribed medication includes evidence citations from reputable medical journals such as The Lancet, BMJ, NEJM, and the Cochrane Database of Systematic Reviews.
- Provides direct PubMed PMID references and study findings confirming medication efficacy and safety.

### 5. Diagnostic Lab Report Upload and Clinical Drug Correlation
- Allows patients to upload pathology, blood, and diagnostic test reports in PDF or image format.
- Extracts measured parameters (such as Serum Creatinine, Fasting Blood Sugar, and Liver Enzymes) with standard reference ranges.
- Automatically correlates abnormal lab results with current prescriptions (for example, warning against NSAIDs if kidney function numbers are elevated).

### 6. Compassionate Care Protocol and Nominee Shield
- For severe diagnoses (such as cancer, advanced tumors, or critical organ failure), the system protects the patient from sudden emotional shock.
- Alerts the designated primary caregiver or nominee first, requiring a secure 4-digit caregiver PIN to unlock raw details.
- When viewed by the patient, the system provides gentle, reassuring, and hopeful explanations focused on treatment steps rather than frightening medical jargon.

### 7. Condition-Specific Personalized Diet and Nutrition
- Automatically generates a complete daily meal plan (Breakfast, Mid-Morning, Lunch, Evening, Dinner) customized to the patient's chronic conditions (Diabetes, Acid Reflux, Hypertension, Arthritis) and current prescriptions.
- Synchronizes meal times with medication schedules (such as taking antacids before meals and painkillers after meals).
- Highlights super healing foods and warns against contraindicated foods that could trigger adverse reactions.
- Provides daily hydration targets and fluid intake rules.

### 8. Medicine Box and Substitute Photo Verifier
- Uses camera input to check whether a medicine box or strip provided by a chemist matches what the doctor prescribed.
- Determines whether the dispensed product is an identical brand, an acceptable generic bio-equivalent, or an incorrect medication.

### 9. Elderly Caretaker Alarms
- Aligns alarms with the patient's real meal habits rather than rigid clock hours.
- Plays gentle web audio chimes and shows clear reminders with high-contrast buttons for seniors.

### 10. Privacy and Compliance
- All medical data is stored on the local device using SQLite.
- Includes an immutable audit logging system tracking every access, scan, and deletion.
- Supports electronic health record (EHR) export and permanent record erasure under patient privacy rights.

---

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- Backend: Python 3.11+, FastAPI, SQLModel, SQLite
- AI and OCR: Google Gemini 2.5 Flash Vision API (with built-in offline clinical demonstration fallbacks)
- Audio: Web Audio API for custom synthesized reminder alarms

---

## Project Structure

```
Curafy AI/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application endpoints
│   │   ├── models.py                   # SQLModel database schemas
│   │   ├── database.py                 # SQLite engine and initial seed data
│   │   └── services/
│   │       ├── gemini_service.py       # Vision AI handwriting OCR
│   │       ├── clinical_proof_service.py # PubMed articles and lighter drug alternatives
│   │       ├── diet_service.py         # Personalized nutrition engine
│   │       ├── report_service.py       # Diagnostic lab report correlation
│   │       ├── interaction_service.py  # Drug-drug and drug-disease checks
│   │       ├── scheduler_service.py    # Meal-aligned alarm generator
│   │       └── medicine_verifier_service.py # Packaging vision verifier
│   ├── uploads/                        # Uploaded images and reports
│   ├── requirements.txt                # Python dependencies
│   └── test_backend.py                 # Backend test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Navigation and senior mode toggle
│   │   │   ├── PrescriptionScanner.tsx # Upload dropzone and sample selectors
│   │   │   ├── PrescriptionResultView.tsx # Decoded medicines, proof, and alternatives
│   │   │   ├── LabReportsView.tsx      # Diagnostic report management and correlation
│   │   │   ├── PersonalizedDietView.tsx# Daily meal schedule and nutrition advice
│   │   │   ├── CaretakerScheduleView.tsx # Meal routines and active alarms
│   │   │   ├── PatientProfileModal.tsx # Chronic conditions and nominee settings
│   │   │   ├── MedicinePhotoVerifierModal.tsx # Chemist box verification
│   │   │   └── HipaaComplianceCenter.tsx # Audit logs and privacy settings
│   │   ├── services/
│   │   │   ├── api.ts                  # REST API client
│   │   │   └── audioAlarm.ts           # Synthesized chime player
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript data interfaces
│   │   ├── App.tsx                     # Main application layout
│   │   └── index.css                   # Global styles and senior mode styling
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Node dependencies
│   └── vite.config.ts                  # Vite development server and API proxy
└── start.sh                            # Development startup script
```

---

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- Python (version 3.10 or higher)

### Setup and Running

1. Open a terminal and navigate to the project directory:
   ```bash
   cd "Curafy AI"
   ```

2. Start the application using the included startup script:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

Alternatively, run the backend and frontend in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

### Accessing the Web Application
- Web Interface: http://localhost:3000
- Backend Interactive API Documentation: http://127.0.0.1:8008/docs

---

## Demonstration Mode

The system includes pre-configured clinical prescriptions for testing without needing an API key:

1. Knee Osteoarthritis: Demonstrates painkiller and antacid synergy alongside chronic acid reflux warnings.
2. Acute Bronchitis: Demonstrates antibiotic and probiotic gut protection synergy with timed intervals.
3. Lumbar Radiculopathy: Demonstrates high-power controlled opioid and steroid warnings with recommended lighter step-down alternatives.
4. Oncology Protocol: Demonstrates the compassionate care shield, nominee PIN unlock (default PIN: 1234), and gentle patient guidance.

To test live camera uploads with custom prescriptions, click the Key button in the top navigation bar and enter your Google Gemini API key.
