from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models import MealRoutine, PrescriptionMedicine, MedicationAlarm

def add_minutes_to_time_str(time_str: str, minutes_offset: int) -> str:
    """Helper to adjust HH:MM by N minutes."""
    try:
        dt = datetime.strptime(time_str.strip(), "%H:%M")
        new_dt = dt + timedelta(minutes=minutes_offset)
        return new_dt.strftime("%H:%M")
    except Exception:
        return time_str

def generate_alarms_for_medicine(
    medicine: PrescriptionMedicine,
    routine: MealRoutine,
    patient_id: int = 1
) -> List[MedicationAlarm]:
    """
    Intelligently determines timing and alarm schedule for a medicine
    based on frequency, instructions, and the patient's recorded meal habits.
    """
    alarms: List[MedicationAlarm] = []
    
    freq_upper = medicine.frequency.upper()
    instr_lower = (medicine.instructions or "").lower()
    timing_rel = (medicine.timing_meal_relation or "").lower()

    # Determine if before meals / empty stomach
    is_before_meal = "before" in instr_lower or "empty" in instr_lower or "ac" in freq_upper or "empty_stomach" in timing_rel
    is_bedtime = "bedtime" in instr_lower or "night" in instr_lower or "hs" in freq_upper or "bedtime" in timing_rel

    # Frequency mapping
    # 1. Once Daily (OD)
    if "OD" in freq_upper or "ONCE" in freq_upper or "1 TIME" in freq_upper:
        if is_bedtime:
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=routine.bedtime,
                meal_context="At Bedtime (before sleep)",
                instructions=f"{medicine.instructions}. Drink with half glass of water."
            ))
        elif is_before_meal:
            # e.g., Pantoprazole empty stomach 30 mins before breakfast
            alarm_time = add_minutes_to_time_str(routine.breakfast_time, -30)
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=alarm_time,
                meal_context=f"30 mins Before Breakfast ({routine.breakfast_time})",
                instructions=f"Empty stomach: {medicine.instructions}"
            ))
        else:
            # Default morning after breakfast
            alarm_time = add_minutes_to_time_str(routine.breakfast_time, 30)
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=alarm_time,
                meal_context=f"30 mins After Breakfast ({routine.breakfast_time})",
                instructions=medicine.instructions
            ))

    # 2. Twice Daily (BD / BID)
    elif "BD" in freq_upper or "BID" in freq_upper or "TWICE" in freq_upper or "2 TIMES" in freq_upper:
        if is_before_meal:
            t1 = add_minutes_to_time_str(routine.breakfast_time, -30)
            t2 = add_minutes_to_time_str(routine.dinner_time, -30)
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=t1,
                meal_context=f"30 mins Before Breakfast ({routine.breakfast_time})",
                instructions=medicine.instructions
            ))
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=t2,
                meal_context=f"30 mins Before Dinner ({routine.dinner_time})",
                instructions=medicine.instructions
            ))
        else:
            t1 = add_minutes_to_time_str(routine.breakfast_time, 30)
            t2 = add_minutes_to_time_str(routine.dinner_time, 30)
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=t1,
                meal_context=f"30 mins After Breakfast ({routine.breakfast_time})",
                instructions=medicine.instructions
            ))
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=t2,
                meal_context=f"30 mins After Dinner ({routine.dinner_time})",
                instructions=medicine.instructions
            ))

    # 3. Thrice Daily (TDS / TID)
    elif "TDS" in freq_upper or "TID" in freq_upper or "THRICE" in freq_upper or "3 TIMES" in freq_upper:
        offset = -30 if is_before_meal else 30
        prefix = "Before" if is_before_meal else "After"
        t1 = add_minutes_to_time_str(routine.breakfast_time, offset)
        t2 = add_minutes_to_time_str(routine.lunch_time, offset)
        t3 = add_minutes_to_time_str(routine.dinner_time, offset)
        
        alarms.append(MedicationAlarm(
            patient_id=patient_id,
            prescription_id=medicine.prescription_id,
            medicine_name=medicine.brand_name,
            dosage=medicine.dosage,
            scheduled_time=t1,
            meal_context=f"30 mins {prefix} Breakfast",
            instructions=medicine.instructions
        ))
        alarms.append(MedicationAlarm(
            patient_id=patient_id,
            prescription_id=medicine.prescription_id,
            medicine_name=medicine.brand_name,
            dosage=medicine.dosage,
            scheduled_time=t2,
            meal_context=f"30 mins {prefix} Lunch",
            instructions=medicine.instructions
        ))
        alarms.append(MedicationAlarm(
            patient_id=patient_id,
            prescription_id=medicine.prescription_id,
            medicine_name=medicine.brand_name,
            dosage=medicine.dosage,
            scheduled_time=t3,
            meal_context=f"30 mins {prefix} Dinner",
            instructions=medicine.instructions
        ))

    # 4. Fallback / SOS
    else:
        # If SOS / As needed
        if "SOS" in freq_upper or "AS NEEDED" in freq_upper or "PRN" in freq_upper:
            # We schedule an informational placeholder or lunch/evening reminder
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time="14:00",
                meal_context="As Needed (SOS) for pain or symptoms",
                instructions=f"Take only when required. Max {medicine.dosage} per day."
            ))
        else:
            # Default to morning after breakfast
            alarm_time = add_minutes_to_time_str(routine.breakfast_time, 30)
            alarms.append(MedicationAlarm(
                patient_id=patient_id,
                prescription_id=medicine.prescription_id,
                medicine_name=medicine.brand_name,
                dosage=medicine.dosage,
                scheduled_time=alarm_time,
                meal_context=f"After Breakfast ({routine.breakfast_time})",
                instructions=medicine.instructions
            ))

    return alarms
