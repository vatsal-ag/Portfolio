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
    }
]
