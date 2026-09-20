from typing import List, Dict, Any
from app.models import PrescriptionMedicine, OngoingMedication, PatientProfile, InteractionRecord

# Common synergy rules (e.g., painkiller + stomach protector)
KNOWN_SYNERGIES = [
    {
        "class_a": ["ibuprofen", "diclofenac", "naproxen", "aceclofenac", "meloxicam", "combiflam", "voveran", "brufen", "aspirin", "painkiller", "nsaid"],
        "class_b": ["pantoprazole", "omeprazole", "rabeprazole", "esomeprazole", "ranitidine", "famotidine", "antacid", "pan", "pantocid", "gas reliever"],
        "title": "Beneficial Synergy: Gastric Mucosal Protection",
        "explanation": "The doctor prescribed {med_b} (an antacid/gas reliever) specifically to counteract the stomach acid irritation and gastritis commonly caused by {med_a} (a painkiller/NSAID).",
        "recommendation": "Take {med_b} 30 minutes before food (or as directed) to shield your stomach lining while taking {med_a}."
    },
    {
        "class_a": ["amoxicillin", "azithromycin", "ciprofloxacin", "augmentin", "antibiotic", "cefixime"],
        "class_b": ["probiotic", "lactobacillus", "sporlac", "darolac", "enterogermina"],
        "title": "Beneficial Synergy: Gut Flora Restoration",
        "explanation": "The doctor paired {med_a} (antibiotic) with {med_b} (probiotic) to preserve your healthy gut microbiome and prevent antibiotic-associated diarrhea.",
        "recommendation": "Take {med_b} at least 2 hours apart from {med_a} for maximum effectiveness."
    },
    {
        "class_a": ["iron", "ferrous ascorbate", "ferrous sulfate", "autrin"],
        "class_b": ["vitamin c", "ascorbic acid", "limcee"],
        "title": "Beneficial Synergy: Enhanced Absorption",
        "explanation": "{med_b} (Vitamin C) significantly increases your intestine's ability to absorb {med_a} (Iron).",
        "recommendation": "Taking these together boosts your hemoglobin recovery time."
    }
]

# Drug-to-Condition Contraindications
CONDITION_CONTRAINDICATIONS = [
    {
        "conditions": ["acid reflux", "gerd", "stomach ulcer", "peptic ulcer", "gastritis", "stomach problem"],
        "drugs": ["ibuprofen", "diclofenac", "naproxen", "aceclofenac", "combiflam", "voveran", "brufen", "aspirin", "ketorolac"],
        "severity": "CRITICAL",
        "title": "High Risk: NSAID Painkiller with Stomach / Acid Reflux History",
        "explanation": "The newly prescribed medicine ({drug}) is an NSAID painkiller that can erode stomach mucus and worsen your chronic stomach problems, acid reflux, or ulcer risks.",
        "recommendation": "Strictly take the prescribed antacid/gastric protector beforehand. Never take this medicine on an empty stomach. Consult your doctor if burning sensations occur."
    },
    {
        "conditions": ["diabetes", "type 2 diabetes", "type 1 diabetes", "high blood sugar"],
        "drugs": ["prednisone", "prednisolone", "dexamethasone", "betamethasone", "steroid", "hydrocortisone"],
        "severity": "CRITICAL",
        "title": "Alert: Steroid Medication Can Spike Blood Sugar",
        "explanation": "{drug} is a corticosteroid which is known to elevate blood glucose levels significantly in patients with chronic Diabetes.",
        "recommendation": "Monitor your blood glucose daily while on this prescription and inform your doctor so your diabetic medication can be adjusted if needed."
    },
    {
        "conditions": ["hypertension", "high blood pressure"],
        "drugs": ["pseudoephedrine", "phenylephrine", "decongestant", "ibuprofen", "diclofenac"],
        "severity": "MODERATE",
        "title": "Caution: Medicine May Elevate Blood Pressure",
        "explanation": "Certain ingredients in {drug} can cause blood vessels to constrict or retain fluid, potentially increasing blood pressure.",
        "recommendation": "Check your blood pressure reading regularly during this course."
    },
    {
        "conditions": ["kidney disease", "chronic kidney disease", "ckd", "renal impairment"],
        "drugs": ["ibuprofen", "diclofenac", "naproxen", "gentamicin", "ciprofloxacin"],
        "severity": "CRITICAL",
        "title": "Severe Warning: Potential Kidney Strain",
        "explanation": "{drug} reduces renal blood flow and can place stress on pre-existing kidney conditions.",
        "recommendation": "Ensure your doctor is fully aware of your kidney history before initiating this medicine."
    }
]

# Drug-to-Drug Interactions between new medicines and ongoing daily medications
DRUG_DRUG_INTERACTIONS = [
    {
        "new_drugs": ["ibuprofen", "diclofenac", "naproxen", "aspirin", "combiflam"],
        "ongoing_drugs": ["aspirin", "warfarin", "clopidogrel", "ecospirin"],
        "severity": "CRITICAL",
        "title": "Severe Bleeding Risk: Dual Antiplatelet / NSAID Interaction",
        "explanation": "You are currently taking {ongoing} (a blood thinner/antiplatelet). Adding {new_drug} (another NSAID) drastically multiplies the risk of internal gastric bleeding.",
        "recommendation": "Contact your prescribing doctor immediately to verify if a safer pain relief alternative (such as Paracetamol) should be used instead."
    },
    {
        "new_drugs": ["ciprofloxacin", "levofloxacin", "antibiotic"],
        "ongoing_drugs": ["metformin"],
        "severity": "MODERATE",
        "title": "Caution: Altered Blood Sugar Control",
        "explanation": "Fluoroquinolone antibiotics like {new_drug} combined with {ongoing} can cause sudden drops or spikes in blood sugar levels.",
        "recommendation": "Keep a glucose monitor handy and have quick carbohydrates (juice or glucose tablets) nearby."
    },
    {
        "new_drugs": ["ibuprofen", "diclofenac", "naproxen"],
        "ongoing_drugs": ["amlodipine", "losartan", "telmisartan", "enalapril"],
        "severity": "MODERATE",
        "title": "Moderate: Antihypertensive Efficacy Reduction",
        "explanation": "NSAIDs like {new_drug} can counteract the blood pressure lowering effect of {ongoing} by causing sodium and fluid retention.",
        "recommendation": "Take for the shortest duration possible and watch for ankle swelling or elevated blood pressure."
    }
]


def check_synergies(new_meds: List[PrescriptionMedicine], prescription_id: int) -> List[InteractionRecord]:
    """Identify synergistic combinations within the new prescription."""
    records = []
    med_names = [f"{m.brand_name.lower()} {m.generic_name.lower()}" for m in new_meds]

    for synergy in KNOWN_SYNERGIES:
        matched_a = None
        matched_b = None
        for i, m in enumerate(new_meds):
            full_str = f"{m.brand_name.lower()} {m.generic_name.lower()}"
            if any(term in full_str for term in synergy["class_a"]) and not matched_a:
                matched_a = m
            elif any(term in full_str for term in synergy["class_b"]) and not matched_b:
                matched_b = m

        if matched_a and matched_b and matched_a.id != matched_b.id:
            # Set the synergy role on medicine b
            matched_b.synergy_role = f"Counteracts gastric acidity/side effects from {matched_a.brand_name}"
            
            records.append(InteractionRecord(
                prescription_id=prescription_id,
                severity="SYNERGY",
                title=synergy["title"],
                interaction_type="SYNERGY_COUNTERACT",
                medicines_involved=f"{matched_a.brand_name} + {matched_b.brand_name}",
                explanation=synergy["explanation"].format(med_a=matched_a.brand_name, med_b=matched_b.brand_name),
                recommendation=synergy["recommendation"]
            ))

    return records


def check_contraindications(
    new_meds: List[PrescriptionMedicine],
    profile: PatientProfile,
    ongoing_meds: List[OngoingMedication],
    prescription_id: int
) -> List[InteractionRecord]:
    """
    Cross-checks new medicines against:
    1. Synergistic pairs within the prescription
    2. Patient's chronic health conditions
    3. Patient's active ongoing daily medications
    """
    records: List[InteractionRecord] = []

    # 1. Synergies
    records.extend(check_synergies(new_meds, prescription_id))

    # 2. Check against chronic conditions
    patient_conditions = [c.lower() for c in profile.chronic_conditions]

    for med in new_meds:
        med_str = f"{med.brand_name.lower()} {med.generic_name.lower()}"
        
        for rule in CONDITION_CONTRAINDICATIONS:
            # Check if any patient condition matches rule conditions
            has_condition = any(
                any(rule_cond in p_cond for rule_cond in rule["conditions"])
                for p_cond in patient_conditions
            )
            if has_condition:
                # Check if medicine matches
                if any(d in med_str for d in rule["drugs"]):
                    records.append(InteractionRecord(
                        prescription_id=prescription_id,
                        severity=rule["severity"],
                        title=rule["title"],
                        interaction_type="DRUG_CONDITION",
                        medicines_involved=f"{med.brand_name} vs Chronic Condition",
                        explanation=rule["explanation"].format(drug=med.brand_name),
                        recommendation=rule["recommendation"]
                    ))

    # 3. Check against ongoing medications (Drug-Drug)
    for med in new_meds:
        med_str = f"{med.brand_name.lower()} {med.generic_name.lower()}"
        
        for ongoing in ongoing_meds:
            if not ongoing.is_active:
                continue
            ongoing_str = f"{ongoing.name.lower()} {ongoing.generic_name.lower()}"

            for d_rule in DRUG_DRUG_INTERACTIONS:
                matches_new = any(d in med_str for d in d_rule["new_drugs"])
                matches_ongoing = any(d in ongoing_str for d in d_rule["ongoing_drugs"])

                if matches_new and matches_ongoing:
                    records.append(InteractionRecord(
                        prescription_id=prescription_id,
                        severity=d_rule["severity"],
                        title=d_rule["title"],
                        interaction_type="DRUG_DRUG",
                        medicines_involved=f"{med.brand_name} (New) + {ongoing.name} (Daily)",
                        explanation=d_rule["explanation"].format(new_drug=med.brand_name, ongoing=ongoing.name),
                        recommendation=d_rule["recommendation"]
                    ))

    return records
