import os
import json
import base64
from typing import Dict, Any, Optional
from PIL import Image
import io

SYSTEM_PRESCRIPTION_PROMPT = """
You are an expert clinical pharmacist and medical handwriting specialist.
Your task is to analyze this handwritten doctor's prescription image and extract structured, accurate patient-friendly information.

Doctors frequently use cursive handwriting and medical shorthand:
- Rx: Treatment/Prescription
- OD: Once a day (q.d.)
- BD / BID: Twice a day
- TDS / TID: Three times a day
- QID: Four times a day
- SOS / PRN: As needed
- Tab / Cap / Syr: Tablet / Capsule / Syrup
- AC: Before meals
- PC: After meals
- HS: At bedtime

Output ONLY a valid JSON object matching this exact schema:
{
  "doctor_name": "Doctor's full name and title if visible, or null",
  "clinic_or_hospital": "Hospital / Clinic name if visible, or null",
  "prescription_date": "YYYY-MM-DD or readable date string if visible, or null",
  "diagnosis": "Diagnosed condition or main complaint (e.g., Acute Joint Pain, Acid Peptic Disease), or null",
  "raw_transcription": "A faithful transcribed representation of the doctor's handwriting",
  "medicines": [
    {
      "brand_name": "Brand name written on prescription (e.g., Combiflam, Pantocid 40)",
      "generic_name": "Chemical / generic name (e.g., Ibuprofen + Paracetamol, Pantoprazole Sodium)",
      "category": "Classification (e.g., Painkiller / NSAID, Antacid / PPI, Antibiotic, Antihistamine)",
      "dosage": "Strength (e.g., 400mg, 40mg, 1 tablet)",
      "frequency": "Frequency code and plain text (e.g., BD (Twice daily), OD (Once daily))",
      "duration": "Duration (e.g., 5 days, 1 week)",
      "instructions": "Specific instructions (e.g., Take strictly 30 mins after meals with warm water)",
      "purpose": "Warm, patient-friendly explanation of what this medicine is used for in plain English",
      "timing_meal_relation": "before_breakfast | after_breakfast | before_lunch | after_lunch | after_dinner | bedtime | as_needed"
    }
  ],
  "doctor_notes": "Any additional precautions or clinical advice written by the doctor"
}
"""

def analyze_prescription_with_gemini(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyzes prescription image using Google Gemini Vision API.
    Falls back gracefully if API key is not configured.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY")

    if not key:
        raise ValueError("GEMINI_API_KEY_NOT_CONFIGURED")

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=key)

        # Build content with prompt and image
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                SYSTEM_PRESCRIPTION_PROMPT
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )

        raw_text = response.text.strip()
        # Clean markdown wrappers if any
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        
        parsed = json.loads(raw_text.strip())
        return parsed
    except Exception as e:
        # If gemini-2.5-flash fails or is unavailable, try gemini-1.5-flash
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    SYSTEM_PRESCRIPTION_PROMPT
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            return json.loads(raw_text.strip())
        except Exception as inner_e:
            raise RuntimeError(f"Gemini Vision API error: {str(inner_e)}")
