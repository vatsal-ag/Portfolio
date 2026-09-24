"""
Diagnostic Lab Report Processing & Clinical Correlation Service for Curafy AI.
Processes patient diagnostic reports (Blood tests, CBC, KFT, LFT, HbA1c, Lipid profiles)
and correlates findings with prescribed and ongoing medications.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime

DEMO_LAB_REPORTS: List[Dict[str, Any]] = [
    {
        "report_title": "Comprehensive Metabolic & Renal Function Panel (KFT / LFT)",
        "report_type": "Biochemistry / Blood Test",
        "report_date": "2026-09-18",
        "lab_name": "Apollo Diagnostics Central Reference Lab",
        "doctor_referred": "Dr. Robert Miller, MD (Orthopedics)",
        "summary_findings": "Serum Creatinine is mildly elevated (1.38 mg/dL) indicating slight age-related renal clearance reduction. Blood Urea Nitrogen is borderline normal. Liver enzymes (SGOT/SGPT) and electrolytes are stable.",
        "parameters": [
            {"parameter": "Serum Creatinine", "value": "1.38", "unit": "mg/dL", "reference": "0.7 - 1.2", "status": "HIGH"},
            {"parameter": "eGFR (Estimated Glomerular Filtration)", "value": "56", "unit": "mL/min/1.73m²", "reference": "> 60", "status": "LOW"},
            {"parameter": "Blood Urea Nitrogen (BUN)", "value": "22", "unit": "mg/dL", "reference": "7 - 20", "status": "HIGH"},
            {"parameter": "Serum Uric Acid", "value": "6.8", "unit": "mg/dL", "reference": "3.5 - 7.2", "status": "NORMAL"},
            {"parameter": "SGOT (AST)", "value": "28", "unit": "U/L", "reference": "10 - 40", "status": "NORMAL"},
            {"parameter": "SGPT (ALT)", "value": "32", "unit": "U/L", "reference": "10 - 45", "status": "NORMAL"},
            {"parameter": "Serum Potassium", "value": "4.4", "unit": "mEq/L", "reference": "3.5 - 5.1", "status": "NORMAL"}
        ],
        "clinical_correlation": "⚠️ Medication Caution: Mild elevation in Serum Creatinine (1.38) combined with eGFR 56 suggests caution with NSAID painkillers (Combiflam/Ibuprofen). Strictly hydrate with at least 2.5L water daily and avoid extending painkiller therapy beyond 5 consecutive days without physician re-evaluation."
    },
    {
        "report_title": "Glycemic Control Profile (HbA1c & Fasting Blood Glucose)",
        "report_type": "Diabetes & Metabolic Panel",
        "report_date": "2026-09-12",
        "lab_name": "Quest Diagnostics Clinical Laboratory",
        "doctor_referred": "Dr. S. Sharma, MD",
        "summary_findings": "Glycated Hemoglobin (HbA1c) is 7.4% reflecting fair long-term glycemic control under current Metformin 500mg therapy. Fasting plasma glucose is 134 mg/dL.",
        "parameters": [
            {"parameter": "HbA1c (Glycated Hemoglobin)", "value": "7.4", "unit": "%", "reference": "< 5.7 (Normal), < 7.0 (Target for Diabetics)", "status": "HIGH"},
            {"parameter": "Estimated Average Glucose (eAG)", "value": "166", "unit": "mg/dL", "reference": "< 154", "status": "HIGH"},
            {"parameter": "Fasting Blood Glucose", "value": "134", "unit": "mg/dL", "reference": "70 - 100", "status": "HIGH"},
            {"parameter": "Post-Prandial Glucose (2h PP)", "value": "182", "unit": "mg/dL", "reference": "< 140", "status": "HIGH"}
        ],
        "clinical_correlation": "🩺 Chronic Interaction Check: Patient's HbA1c is 7.4%. Avoid systemic corticosteroid injections or oral steroids (Prednisolone) without strict glucose monitoring, as steroids can trigger severe acute hyperglycemic spikes."
    }
]


def correlate_report_with_prescriptions(
    report_parameters: List[Dict[str, Any]],
    active_medicines: List[str]
) -> str:
    """Computes automated clinical correlations between lab parameters and medications."""
    correlations = []
    meds_str = " ".join(active_medicines).lower()
    
    for p in report_parameters:
        p_name = p.get("parameter", "").lower()
        status = p.get("status", "NORMAL")
        
        # Creatinine / Renal checks
        if ("creatinine" in p_name or "egfr" in p_name or "bun" in p_name) and status in ["HIGH", "LOW", "CRITICAL"]:
            if any(nsaid in meds_str for nsaid in ["ibuprofen", "combiflam", "diclofenac", "naproxen", "voveran"]):
                correlations.append(
                    "⚠️ Renal Alert: Elevated Creatinine / reduced eGFR indicates mild kidney strain. NSAID painkillers reduce renal prostaglandin flow; stay well hydrated and do not exceed 5 days."
                )
                
        # Glucose / Diabetes checks
        if ("glucose" in p_name or "hba1c" in p_name) and status in ["HIGH", "CRITICAL"]:
            if any(steroid in meds_str for steroid in ["prednisolone", "dexamethasone", "steroid"]):
                correlations.append(
                    "🚨 Glycemic Alert: Lab reports elevated blood glucose. Prescribed corticosteroid may induce further sugar spikes. Monitor fasting blood glucose daily."
                )
                
        # Liver Function checks
        if ("sgot" in p_name or "sgpt" in p_name or "bilirubin" in p_name) and status in ["HIGH", "CRITICAL"]:
            if any(m in meds_str for m in ["paracetamol", "combiflam", "amoxicillin"]):
                correlations.append(
                    "🟡 Hepatic Precaution: Liver enzyme values are elevated. Exercise caution with high-dose Paracetamol (>2000mg/day) and review with your physician."
                )
                
    if not correlations:
        return "✓ Clinical Correlation: Lab report parameters are compatible with current prescriptions. No acute metabolic conflicts detected."
    return " | ".join(correlations)
