from typing import Dict, Any, List

DEMO_PRESCRIPTIONS = [
    {
        "id": "sample-painkiller-synergy",
        "title": "Knee Joint Arthritis & Pain Management",
        "doctor_name": "Dr. Robert Miller, MD (Orthopedics)",
        "clinic_or_hospital": "St. Jude Orthopedic & Joint Center",
        "prescription_date": "2026-09-15",
        "diagnosis": "Acute Knee Osteoarthritis & Joint Inflammation",
        "raw_ocr_text": "Rx:\n1. Tab. Combiflam (400mg) - 1 Tab BD x 5 days (pc)\n2. Cap. Pantocid 40mg - 1 Cap OD x 5 days (30m ac)\n3. Tab. Shelcal 500 - 1 Tab OD x 15 days (pc night)\nAdvice: Hot fermentation, avoid squatting.",
        "notes": "Patient advised rest for 5 days and warm compression on left knee.",
        "medicines": [
            {
                "brand_name": "Combiflam",
                "generic_name": "Ibuprofen (400mg) + Paracetamol (325mg)",
                "category": "NSAID Painkiller & Anti-inflammatory",
                "dosage": "1 tablet (400mg/325mg)",
                "frequency": "BD (Twice daily after meals)",
                "duration": "5 days",
                "instructions": "Take strictly 30 minutes after breakfast and dinner with plenty of water.",
                "purpose": "Provides fast relief from joint pain, swelling, and musculoskeletal stiffness.",
                "timing_meal_relation": "after_breakfast_dinner"
            },
            {
                "brand_name": "Pantocid 40",
                "generic_name": "Pantoprazole Sodium (40mg)",
                "category": "Proton Pump Inhibitor / Antacid & Gas Reliever",
                "dosage": "1 capsule (40mg)",
                "frequency": "OD (Once daily in morning)",
                "duration": "5 days",
                "instructions": "Take empty stomach 30 minutes before your morning breakfast.",
                "purpose": "Reduces stomach acid production and prevents gas, heartburn, and stomach ulcers.",
                "timing_meal_relation": "before_breakfast"
            },
            {
                "brand_name": "Shelcal 500",
                "generic_name": "Calcium Carbonate (500mg) + Vitamin D3 (250 IU)",
                "category": "Mineral & Vitamin Bone Supplement",
                "dosage": "1 tablet",
                "frequency": "OD (Once daily at night)",
                "duration": "15 days",
                "instructions": "Take 30 minutes after dinner.",
                "purpose": "Strengthens bone density and aids joint cartilage repair.",
                "timing_meal_relation": "after_dinner"
            }
        ]
    },
    {
        "id": "sample-respiratory-infection",
        "title": "Chest Congestion & Acute Bronchitis",
        "doctor_name": "Dr. Elizabeth Chen, MD (Pulmonology)",
        "clinic_or_hospital": "Metropolitan Chest & Allergy Clinic",
        "prescription_date": "2026-09-16",
        "diagnosis": "Acute Bacterial Bronchitis & Wheezing",
        "raw_ocr_text": "Rx:\n1. Tab. Augmentin 625mg - 1 Tab BD x 5 days (pc)\n2. Cap. Darolac - 1 Cap BD x 5 days (2h after food)\n3. Tab. Montair LC - 1 Tab OD x 7 days (hs)",
        "notes": "Drink warm fluids. Steam inhalation twice daily.",
        "medicines": [
            {
                "brand_name": "Augmentin 625",
                "generic_name": "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
                "category": "Broad-Spectrum Antibacterial",
                "dosage": "1 tablet (625mg)",
                "frequency": "BD (Twice daily)",
                "duration": "5 days",
                "instructions": "Take with or right after food to ensure optimal absorption.",
                "purpose": "Eliminates bacterial infection causing chest congestion and cough.",
                "timing_meal_relation": "after_breakfast_dinner"
            },
            {
                "brand_name": "Darolac",
                "generic_name": "Lactobacillus + Probiotic Blend",
                "category": "Probiotic & Gut Flora Protector",
                "dosage": "1 capsule",
                "frequency": "BD (Twice daily)",
                "duration": "5 days",
                "instructions": "Take 2 hours after your antibiotic dose.",
                "purpose": "Protects your digestive tract and prevents stomach upset caused by the antibiotic.",
                "timing_meal_relation": "after_lunch"
            },
            {
                "brand_name": "Montair LC",
                "generic_name": "Montelukast (10mg) + Levocetirizine (5mg)",
                "category": "Antiallergic & Bronchodilator",
                "dosage": "1 tablet",
                "frequency": "OD (Once daily at bedtime)",
                "duration": "7 days",
                "instructions": "Take 30 minutes before sleep.",
                "purpose": "Relieves nighttime wheezing, allergic coughing, and opens airways.",
                "timing_meal_relation": "bedtime"
            }
        ]
    },
    {
        "id": "sample-controlled-spine",
        "title": "Severe Sciatica & Lumbar Disc Herniation (Controlled Meds)",
        "doctor_name": "Dr. Marcus Vance, MD (Spine Specialist)",
        "clinic_or_hospital": "Neurology & Spine Wellness Institute",
        "prescription_date": "2026-09-19",
        "diagnosis": "Severe Lumbar Radiculopathy & Acute Nerve Compression",
        "raw_ocr_text": "Rx:\n1. Tab. Tramadol (50mg) - 1 Tab SOS / BD x 5 days (Strictly monitored)\n2. Tab. Prednisolone (20mg) - 1 Tab OD x 4 days tapering\n3. Cap. Pantocid (40mg) - 1 Cap OD (30m ac)\nAdvice: Strictly avoid driving; report excessive drowsiness or sugar spikes.",
        "notes": "Controlled substance protocol. Caution for dependence and glycemic elevation in diabetics.",
        "medicines": [
            {
                "brand_name": "Tramadol 50",
                "generic_name": "Tramadol Hydrochloride (50mg)",
                "category": "Opioid Analgesic / Controlled Substance",
                "dosage": "1 tablet (50mg)",
                "frequency": "BD SOS (Only if pain is severe)",
                "duration": "5 days",
                "instructions": "Take with water. Do not drive or operate machinery. Do not mix with alcohol.",
                "purpose": "Central pain suppression for severe nerve compression and intractable spine pain.",
                "timing_meal_relation": "after_dinner"
            },
            {
                "brand_name": "Prednisolone 20",
                "generic_name": "Prednisolone (20mg)",
                "category": "Potent Corticosteroid / Anti-inflammatory",
                "dosage": "1 tablet (20mg)",
                "frequency": "OD in the morning with food",
                "duration": "4 days",
                "instructions": "Take strictly in the morning with breakfast to mimic natural cortisol cycle.",
                "purpose": "Rapidly suppresses acute spinal nerve sheath swelling and radiating sciatica pain.",
                "timing_meal_relation": "after_breakfast"
            },
            {
                "brand_name": "Pantocid 40",
                "generic_name": "Pantoprazole Sodium (40mg)",
                "category": "Proton Pump Inhibitor / Antacid",
                "dosage": "1 capsule (40mg)",
                "frequency": "OD in the morning",
                "duration": "5 days",
                "instructions": "Take on empty stomach 30 mins before breakfast.",
                "purpose": "Shields gastric mucosa from steroid-induced ulceration and acidity.",
                "timing_meal_relation": "before_breakfast"
            }
        ]
    },
    {
        "id": "sample-compassionate-oncology",
        "title": "Specialty Oncology Consultation (Compassionate Care Mode)",
        "doctor_name": "Dr. Eleanor Wright, MD, DM (Medical Oncology)",
        "clinic_or_hospital": "Comprehensive Cancer Care & Research Center",
        "prescription_date": "2026-09-20",
        "diagnosis": "Metastatic Breast Carcinoma (Stage IV) - Maintenance Protocol",
        "raw_ocr_text": "Rx:\n1. Tab. Capecitabine (500mg) - 2 Tabs BD x 14 days on, 7 days off\n2. Tab. Ondansetron (8mg) - 1 Tab BD 30m prior to Capecitabine\n3. Tab. Pantocid (40mg) - 1 Tab OD ac\nAdvice: Maintain high hydration, report hand-foot erythema immediately.",
        "notes": "Compassionate Care Protocol active. Family/Nominee briefed first regarding treatment trajectory.",
        "medicines": [
            {
                "brand_name": "Capecitabine 500",
                "generic_name": "Capecitabine (500mg)",
                "category": "Antineoplastic / Chemotherapy Cytotoxic Agent",
                "dosage": "2 tablets (1000mg total)",
                "frequency": "BD (Twice daily)",
                "duration": "14 days",
                "instructions": "Swallow with a full glass of water within 30 minutes after completing a meal.",
                "purpose": "Oral chemotherapy that targets and arrests abnormal cellular proliferation.",
                "timing_meal_relation": "after_breakfast_dinner"
            },
            {
                "brand_name": "Emeset 8",
                "generic_name": "Ondansetron Hydrochloride (8mg)",
                "category": "5-HT3 Receptor Antagonist / Anti-emetic",
                "dosage": "1 tablet (8mg)",
                "frequency": "BD (30 mins before Capecitabine)",
                "duration": "14 days",
                "instructions": "Take 30 minutes before oral chemotherapy to block nausea signals.",
                "purpose": "Prevents treatment-associated nausea and gastrointestinal discomfort.",
                "timing_meal_relation": "before_breakfast"
            },
            {
                "brand_name": "Pantocid 40",
                "generic_name": "Pantoprazole Sodium (40mg)",
                "category": "Proton Pump Inhibitor / Gastro-Protective",
                "dosage": "1 capsule",
                "frequency": "OD in the morning",
                "duration": "14 days",
                "instructions": "Take on empty stomach 30 mins before breakfast.",
                "purpose": "Maintains stomach mucosal integrity during intensive pharmacotherapy.",
                "timing_meal_relation": "before_breakfast"
            }
        ]
    }
]
