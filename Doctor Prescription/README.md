# RxVision AI • Doctor Prescription Reader, Safety Interaction & Caretaker Assistant

An intelligent, patient-centric healthcare application that digitizes handwritten doctor prescriptions, translates them into clear patient-friendly insights, detects medicine synergies and contraindications against chronic health profiles, and provides an elderly caretaker routine scheduler with meal-aligned alarms.

Strictly adheres to **HIPAA (45 CFR § 164.312 / 164.502)** and the **Indian Information Technology Act 2000 (SPDI Rules Section 43A & 72A)**.

---

## Key Features

1. **Doctor Handwriting Deciphering (Gemini Vision AI)**:
   - Accurately reads difficult cursive doctor handwriting, medical abbreviations (`Rx`, `OD`, `BD`, `TDS`, `AC`, `PC`, `HS`, `SOS`), dosages, and instructions.
   - Translates technical pharmaceutical formulations into clear, reassuring patient language.

2. **Medicine Synergy Intelligence**:
   - Analyzes why certain medicines are paired together.
   - **Example**: Specifically explains why a gas reliever/antacid (e.g. *Pantoprazole / Pantocid 40*) is prescribed alongside a painkiller (e.g. *Combiflam / Ibuprofen / Diclofenac*) to counteract gastric mucosal irritation and prevent gastritis.
   - **Example**: Explains antibiotic + probiotic pairings to preserve healthy gut flora.

3. **Chronic Health & Interaction Safety Engine**:
   - Maintains a patient profile with long-term conditions (*Type 2 Diabetes, Hypertension, Acid Reflux/GERD, Chronic Kidney Disease*) and daily medications (*Metformin, Amlodipine*).
   - Automatically cross-checks newly scanned prescriptions for:
     - **Drug-to-Disease Contraindications** (e.g., NSAID painkillers with chronic Acid Reflux/GERD or Kidney Disease; Steroids with Diabetes).
     - **Drug-to-Drug Interactions** (e.g., NSAIDs with Blood Thinners like Aspirin/Warfarin; Fluoroquinolones with Metformin).

4. **Elderly Caretaker & Meal-Aligned Smart Alarms**:
   - Tailored for seniors living independently.
   - Records daily eating habits (breakfast, lunch, dinner, bedtime hours).
   - Intelligently schedules medication alarms aligned with meals:
     - *Empty stomach / Before meals*: 30 minutes before breakfast (e.g. 08:00 AM for 08:30 AM breakfast).
     - *After meals*: 30 minutes after breakfast/dinner (e.g. 09:00 AM, 20:30 PM).
   - Features browser notification alerts and gentle **Web Audio API** synthesized chimes.
   - Senior-friendly, extra-large font reminder modal with large buttons: *"I Have Taken This Medicine"*, *"Snooze 10 Mins"*, *"Call Caretaker"*.

5. **Dated Medical History Vault**:
   - Archives and dates every scanned prescription image and decoded summary.
   - Patients no longer need to carry or keep fragile physical paper prescription files.
   - Searchable by doctor, date, condition, or medication name.

6. **HIPAA & IT Act 2000 Compliance**:
   - **Local Custody**: Health data and scans reside on the patient's own machine/device (zero cloud vendor lock-in).
   - **Access Control & Immutable Audit Logging**: Every scan, record access, profile change, and deletion is recorded in a tamper-evident audit trail under HIPAA 45 CFR § 164.312(b).
   - **Right to Erasure / "Right to be Forgotten"**: Permanent expunging of medical records per patient request.
   - **Data Portability**: 1-click full Electronic Health Record (EHR JSON) export.

---

## Quick Start

### 1. Launch Both Backend & Frontend
Run the all-in-one launcher:
```bash
./start.sh
```

Or run separately:

**Backend (FastAPI):**
```bash
PYTHONPATH=backend backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Frontend (React + Vite):**
```bash
npm run dev --prefix frontend
```

Open your browser at:
- **Web App:** [http://localhost:5173](http://localhost:5173)
- **Interactive API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Testing & Demo Mode

- The app comes loaded with pre-configured realistic clinical prescriptions:
  1. **Sample 1**: Knee Osteoarthritis (*Combiflam* painkiller + *Pantocid 40* gas reliever synergy + Acid Reflux alert).
  2. **Sample 2**: Acute Bronchitis (*Augmentin* antibiotic + *Darolac* probiotic gut flora synergy).
- Click the **"Key"** button in the header to enter your Google Gemini API key anytime for live handwriting recognition of your own camera uploads.
- Run automated tests:
  ```bash
  PYTHONPATH=backend backend/venv/bin/python backend/test_backend.py
  ```
