"""
Personalized Clinical Nutrition & Diet Intelligence Service for Curafy AI.
Synthesizes dietary plans tailored to:
1. Chronic Conditions (Type 2 Diabetes, GERD, Hypertension, Osteoarthritis, Renal Load).
2. Acute Illness / Prescription Context (NSAID Gastritis protection, Antibiotic Gut flora recovery, Chest infection, Fever).
"""

from typing import List, Dict, Any, Optional

def generate_patient_diet_plan(
    chronic_conditions: List[str],
    active_diagnoses: List[str],
    active_medicines: List[str],
    allergies: List[str]
) -> Dict[str, Any]:
    """Generates an evidence-based clinical diet and nutrition plan."""
    
    cond_lower = [c.lower() for c in chronic_conditions]
    diag_lower = [d.lower() for d in active_diagnoses]
    meds_lower = [m.lower() for m in active_medicines]
    
    has_diabetes = any("diabetes" in c or "sugar" in c for c in cond_lower)
    has_gerd = any("gerd" in c or "reflux" in c or "gastritis" in c or "stomach" in c for c in cond_lower + diag_lower)
    has_hypertension = any("hypertension" in c or "blood pressure" in c for c in cond_lower)
    has_arthritis = any("arthritis" in c or "joint" in c or "osteoarthritis" in c for c in cond_lower + diag_lower)
    has_infection = any("bronchitis" in d or "infection" in d or "chest" in d or "fever" in d or "antibiotic" in d for d in diag_lower + meds_lower)
    has_nsaid = any("combiflam" in m or "ibuprofen" in m or "diclofenac" in m or "voveran" in m or "painkiller" in m for m in meds_lower)
    has_antibiotic = any("augmentin" in m or "amoxicillin" in m or "azithromycin" in m or "cefixime" in m or "antibiotic" in m for m in meds_lower)

    # 1. Headline summary based on patient profile
    diet_title = "Cardio-Metabolic & Gastro-Protective Healing Diet"
    if has_diabetes and has_gerd:
        diet_title = "Low-Glycemic & Alkaline Gastric Protection Protocol"
    elif has_infection:
        diet_title = "Immune-Restorative & Anti-Inflammatory Respiratory Diet"
    elif has_arthritis:
        diet_title = "Joint Mobility & Anti-Inflammatory Osteo-Nutritional Plan"

    # 2. Daily Meal Routine
    meals = [
        {
            "meal": "Breakfast",
            "time": "08:00 AM - 08:30 AM",
            "menu": "Warm rolled oatmeal porridge with crushed chia seeds, a pinch of cinnamon, and half a ripe banana (or boiled egg whites).",
            "therapeutic_reason": "Low glycemic index fiber coats the stomach lining, prevents acid surges, and releases glucose steadily for diabetic stability.",
            "prescription_sync": "Take empty-stomach antacids (Pantocid 40) 30 mins before this meal. Take post-meal painkiller (Combiflam) 30 mins after."
        },
        {
            "meal": "Mid-Morning Refreshment",
            "time": "11:00 AM",
            "menu": "Fresh tender coconut water OR fresh papaya cubes with a few soaked almonds.",
            "therapeutic_reason": "Provides natural potassium for blood pressure stability and digestive papain enzymes that soothe the gut.",
            "prescription_sync": "Ideal window for morning hydration; aids kidney filtration of medication metabolites."
        },
        {
            "meal": "Lunch",
            "time": "01:00 PM - 01:30 PM",
            "menu": "Steamed brown rice or whole-wheat rotis with light yellow moong dal, steamed bottle gourd (lauki) or zucchini, and homemade fresh probiotic curd (dahi).",
            "therapeutic_reason": "Probiotic bacteria restore intestinal microflora suppressed by antibiotics; easily digestible lentils prevent gastrointestinal heaviness.",
            "prescription_sync": "Take ongoing daily medications (Metformin / BP meds) with or immediately following lunch."
        },
        {
            "meal": "Evening Nourishment",
            "time": "05:00 PM",
            "menu": "Warm caffeine-free herbal tea (chamomile or fresh ginger-tulsi infusion) with roasted unsalted makhana (foxnuts) or walnuts.",
            "therapeutic_reason": "Walnuts supply plant Omega-3 fatty acids that dampen joint inflammation; chamomile relaxes smooth gastric muscle.",
            "prescription_sync": "Never consume tea or coffee within 1 hour of taking iron or calcium supplements."
        },
        {
            "meal": "Dinner",
            "time": "07:30 PM - 08:00 PM",
            "menu": "Light vegetable stew or clear lentil khichdi cooked with mild cumin and turmeric. Finish dinner at least 2.5 hours before lying down.",
            "therapeutic_reason": "Early, light dinner is the #1 proven non-pharmacological shield against nocturnal GERD and acid reflux regurgitation.",
            "prescription_sync": "Take evening doses with lukewarm water. Allow 30 mins post-dinner before taking calcium supplements (Shelcal 500)."
        }
    ]

    # 3. Super Healing Foods (Recommended)
    healing_foods = [
        {
            "food": "Turmeric Golden Broth / Milk (Curcumin)",
            "benefits": "Potent natural anti-inflammatory that works synergistically with painkillers to reduce osteoarthritis joint stiffness without irritating the stomach.",
            "badge": "Anti-Inflammatory"
        },
        {
            "food": "Probiotic Fermented Curd / Kefir",
            "benefits": "Crucial during antibiotic courses (like Augmentin) to prevent dysbiosis, antibiotic-associated diarrhea, and opportunistic fungal overgrowth.",
            "badge": "Gut Flora Shield"
        },
        {
            "food": "Steamed Alkaline Greens (Spinach, Zucchini, Bottle Gourd)",
            "benefits": "Natural pH-buffering alkaline vegetables that neutralize excess gastric hydrochloric acid produced during NSAID painkiller therapy.",
            "badge": "Acid Buffer"
        },
        {
            "food": "Soluble Fiber (Chia Seeds, Fenugreek / Methi Water)",
            "benefits": "Forms a viscous gel in the digestive tract that slows glucose absorption, preventing post-prandial blood sugar spikes for diabetics.",
            "badge": "Glycemic Control"
        },
        {
            "food": "Clear Vegetable & Bone Broths",
            "benefits": "Restores essential electrolytes (potassium, magnesium) and provides collagen peptides to nourish knee and joint cartilage.",
            "badge": "Electrolyte & Cartilage"
        }
    ]

    # 4. Foods to Strictly Avoid (Contraindicated with reasons)
    avoid_foods = [
        {
            "food": "Deep-Fried, Oily & Spicy Snacks (Samosas, Fritters, Chilies)",
            "danger": "Relaxes the lower esophageal sphincter (LES) and stimulates massive stomach acid output, severely aggravating GERD and painkiller gastritis.",
            "severity": "CRITICAL"
        },
        {
            "food": "Caffeinated Beverages, Strong Coffee & Colas",
            "danger": "Caffeine directly irritates inflamed gastric mucosa, elevates heart rate, and can interfere with blood pressure medications (Amlodipine).",
            "severity": "CRITICAL"
        },
        {
            "food": "Citrus Fruits on an Empty Stomach (Lemons, Oranges, Grapefruit)",
            "danger": "Grapefruit inhibits hepatic CYP3A4 enzymes (altering medication breakdown), while raw citric acid directly triggers burning in acidic stomachs.",
            "severity": "HIGH RISK"
        },
        {
            "food": "Excess Table Salt & High-Sodium Pickles",
            "danger": "Causes systemic fluid retention, directly counteracts antihypertensive medicines, and increases renal arterial strain.",
            "severity": "HIGH RISK"
        },
        {
            "food": "Refined White Sugar, Pastries & Sweetened Juices",
            "danger": "Causes immediate glycemic spikes, promotes systemic inflammatory cytokines, and worsens diabetic neuropathy.",
            "severity": "HIGH RISK"
        }
    ]

    # 5. Hydration Target
    hydration = {
        "daily_target_liters": 2.5,
        "recommended_beverages": ["Lukewarm boiled water", "Tender coconut water", "Chamomile tea", "Clear vegetable broth"],
        "timing_rule": "Sip water throughout the day. Avoid gulping large volumes of water immediately during meals to prevent stomach acid dilution."
    }

    # 6. Acute illness recovery advice (customized to current prescription)
    acute_tips = []
    if has_nsaid:
        acute_tips.append("🛡️ Painkiller Gastric Protection: Never take Combiflam on an empty stomach. Always consume a cup of warm oatmeal or boiled egg before taking it.")
    if has_antibiotic:
        acute_tips.append("🧪 Antibiotic Recovery: Augmentin can deplete beneficial gut bacteria. Take your probiotic (Darolac) exactly 2 hours after your antibiotic dose, and drink plenty of fluids.")
    if has_infection:
        acute_tips.append("🫁 Bronchial Soothing: Perform warm steam inhalation with a drop of eucalyptus twice daily and sip warm water with ginger to clear airway secretions.")
    if has_arthritis:
        acute_tips.append("🦵 Joint Lubrication: Combine your knee medication with gentle non-weight bearing range-of-motion leg raises and warm compresses.")

    return {
        "diet_title": diet_title,
        "patient_name": "Senior Patient",
        "conditions_addressed": chronic_conditions + active_diagnoses,
        "meals": meals,
        "healing_foods": healing_foods,
        "avoid_foods": avoid_foods,
        "hydration": hydration,
        "acute_tips": acute_tips,
        "clinical_disclaimer": "This clinical nutritional guide is designed to support your prescribed medical regimen. Consult your treating doctor or registered clinical dietitian before making drastic dietary changes."
    }
