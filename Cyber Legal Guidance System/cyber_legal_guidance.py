# Cyber Legal Guidance System

import os
import datetime

# BNS & IT ACT Knowledge Base (Dictionaries)

BNS_SECTIONS = {
    "318": {
        "title": "Cheating",
        "description": "Whoever cheats shall be punished with imprisonment up to 3 years and/or fine.",
        "related_crimes": ["upi fraud", "online fraud", "fake seller", "advance fee fraud", "lottery fraud"]
    },
    "319": {
        "title": "Cheating by personation",
        "description": "Pretending to be another person to deceive. Punishable up to 5 years.",
        "related_crimes": ["identity theft", "fake profile", "impersonation", "fake account"]
    },
    "316": {
        "title": "Criminal breach of trust",
        "description": "Dishonest misappropriation of entrusted property. Punishable up to 7 years.",
        "related_crimes": ["investment fraud", "ponzi scheme", "broker fraud", "financial misappropriation"]
    },
    "111": {
        "title": "Organised Crime",
        "description": "New BNS section covering organized criminal syndicates including cyber fraud networks.",
        "related_crimes": ["syndicate fraud", "gang fraud", "organised scam", "coordinated attack"]
    },
    "308": {
        "title": "Extortion",
        "description": "Intentionally putting a person in fear to deliver property. Up to 3 years imprisonment.",
        "related_crimes": ["sextortion", "blackmail", "ransomware", "extortion", "threatening"]
    },
    "336": {
        "title": "Forgery",
        "description": "Making a false document or electronic record with intent to cause harm. Up to 2 years.",
        "related_crimes": ["fake document", "forged cheque", "fake id", "document fraud"]
    },
    "338": {
        "title": "Forgery of a valuable security",
        "description": "Forgery of documents like cheques, wills, or electronic records. Up to 7 years.",
        "related_crimes": ["cheque fraud", "fake bank document", "forged signature"]
    },
}

IT_ACT_SECTIONS = {
    "66": {
        "title": "Computer-Related Offences",
        "description": "Hacking, data theft, spreading viruses. Imprisonment up to 3 years and/or fine up to ₹5 lakh.",
        "related_crimes": ["hacking", "account hack", "phone hack", "data breach", "virus", "malware"]
    },
    "66C": {
        "title": "Identity Theft",
        "description": "Fraudulently using another person's electronic signature, password, or unique ID. Up to 3 years.",
        "related_crimes": ["password stolen", "otp fraud", "sim swap", "identity theft", "credential theft"]
    },
    "66D": {
        "title": "Cheating by Personation using Computer",
        "description": "Impersonating using a computer resource. Up to 3 years and ₹1 lakh fine.",
        "related_crimes": ["fake email", "phishing", "spear phishing", "spoofing", "fake website"]
    },
    "66E": {
        "title": "Violation of Privacy",
        "description": "Capturing/publishing private images without consent. Up to 3 years and ₹2 lakh fine.",
        "related_crimes": ["sextortion", "morphed photo", "privacy violation", "revenge porn", "voyeurism"]
    },
    "67": {
        "title": "Publishing Obscene Material",
        "description": "Publishing obscene content electronically. Up to 5 years and ₹10 lakh fine.",
        "related_crimes": ["obscene content", "pornographic content", "morphed image circulated"]
    },
    "43": {
        "title": "Penalty for Damage to Computer",
        "description": "Unauthorized access, data theft, denial of service. Civil liability for compensation.",
        "related_crimes": ["unauthorized access", "data theft", "dos attack", "ddos", "system damage"]
    },
    "72": {
        "title": "Breach of Confidentiality and Privacy",
        "description": "Disclosing personal data obtained in a fiduciary role without consent. Up to 2 years.",
        "related_crimes": ["data leak", "personal data sold", "breach of confidentiality"]
    },
}

# Crime type -> Sections mapping
CRIME_LEGAL_MAP = {
    "upi_fraud": {
        "bns": ["318"],
        "it_act": ["66C", "66D"],
        "emergency_steps": [
            "Call 1930 (National Cybercrime Helpline) IMMEDIATELY",
            "Call your bank's fraud helpline to freeze the transaction",
            "File complaint at cybercrime.gov.in within the Golden Hour",
            "Note down the Transaction ID (UTR/TXN No.) as evidence",
            "Take screenshots of all messages and transactions"
        ]
    },
    "hacking": {
        "bns": ["316"],
        "it_act": ["66", "43"],
        "emergency_steps": [
            "Change all passwords immediately from a different device",
            "Enable 2-Factor Authentication on all accounts",
            "Call 1930 (National Cybercrime Helpline)",
            "Contact your bank to block any linked accounts",
            "File FIR at nearest cyber police station"
        ]
    },
    "phishing": {
        "bns": ["318", "319"],
        "it_act": ["66D", "66C"],
        "emergency_steps": [
            "Do NOT click any suspicious links",
            "Call 1930 (National Cybercrime Helpline)",
            "Report the phishing URL to Google Safe Browsing",
            "Inform your bank if financial details were shared",
            "File complaint at cybercrime.gov.in"
        ]
    },
    "identity_theft": {
        "bns": ["319", "336"],
        "it_act": ["66C", "66D"],
        "emergency_steps": [
            "Report to UIDAI if Aadhaar is misused: 1947",
            "Call 1930 (National Cybercrime Helpline)",
            "Alert your bank to watch for unauthorized activities",
            "File a police complaint with all evidence",
            "Notify credit bureaus (CIBIL) about potential fraud"
        ]
    },
    "sextortion": {
        "bns": ["308"],
        "it_act": ["66E", "67"],
        "emergency_steps": [
            "Do NOT pay the blackmailer",
            "Call 1930 IMMEDIATELY — dedicated team available",
            "Block the blackmailer on all platforms",
            "Preserve all chat screenshots as evidence",
            "File complaint at cybercrime.gov.in — Women/Child cell available"
        ]
    },
    "investment_fraud": {
        "bns": ["316", "318"],
        "it_act": ["66", "66D"],
        "emergency_steps": [
            "Stop all further transactions immediately",
            "Call 1930 (National Cybercrime Helpline)",
            "Report to SEBI if stock/crypto fraud: 1800-266-7575",
            "Collect all payment receipts and conversation records",
            "File complaint at cybercrime.gov.in"
        ]
    },
    "data_breach": {
        "bns": ["316"],
        "it_act": ["43", "72"],
        "emergency_steps": [
            "Change all passwords and enable 2FA",
            "Monitor your bank accounts for suspicious activity",
            "Report to CERT-In: incident@cert-in.org.in",
            "Call 1930 (National Cybercrime Helpline)",
            "File FIR at cyber police station"
        ]
    },
    "online_harassment": {
        "bns": ["308", "351"],
        "it_act": ["66E", "67"],
        "emergency_steps": [
            "Block the harasser on all platforms",
            "Report the account on the respective platform",
            "Preserve all screenshots as evidence",
            "Call 1930 or visit cybercrime.gov.in",
            "Contact Women Helpline: 181 (if applicable)"
        ]
    },
}

# Core Functions

def display_header():
    # Display the system banner.
    print("   CYBER LEGAL GUIDANCE SYSTEM")
    print("   Bharatiya Nyaya Sanhita (BNS) 2023 | IT Act 2000")
    print("   Legal First-Aid for Cybercrime Victims")
    print(f"   Date: {datetime.datetime.now().strftime('%d %B %Y | %I:%M %p')}")


def display_menu():
    # Display the main menu options.
    print("          MAIN MENU"                  )
    print(" 1. Identify Crime & Get Legal Aid   ")
    print(" 2. Search BNS Section               ")
    print(" 3. Search IT Act Section            ")
    print(" 4. Generate Complaint Handout       ")
    print(" 5. View Past Reports                ")
    print(" 6. Emergency Contacts               ")
    print(" 7. Exit")
    print("\nEnter your choice (1-7): ", end="")


def get_crime_type_from_keywords(user_input):

    # Match user's description keywords to a known crime category.
    # Uses basic string matching — no NLP required.
    # Returns (crime_type, confidence_score)
    
    user_input_lower = user_input.lower()

    # Keyword map: crime_type -> keywords to match
    keyword_map = {
        "upi_fraud":       ["upi", "upi fraud", "gpay", "phonepe", "paytm", "bank transfer", "neft", "rtgs",
                            "money deducted", "balance", "transaction", "txn", "utr", "cheated online"],
        "hacking":         ["hack", "hacked", "compromised", "account taken", "phone hack", "email hack",
                            "logged in", "someone accessed"],
        "phishing":        ["phishing", "fake link", "fake website", "clicked link", "otp asked",
                            "fake email", "bank email", "reward link", "lottery link"],
        "identity_theft":  ["identity", "aadhaar misuse", "pan misuse", "fake account my name",
                            "impersonating", "someone using my id", "sim swap", "duplicate sim"],
        "sextortion":      ["blackmail", "video call", "intimate video", "threatening",
                            "extortion", "compromising photo", "morphed"],
        "investment_fraud":["investment", "trading", "crypto", "returns", "profit", "broker",
                            "stock fraud", "ponzi", "mlm", "multi level", "doubling money"],
        "data_breach":     ["data leak", "data breach", "personal data", "information stolen",
                            "database", "records leaked"],
        "online_harassment":["harassment", "trolling", "abuse online", "stalking", "threatening message",
                             "cyberbullying", "defamation", "fake post about me"],
    }

    scores = {}
    for crime_type, keywords in keyword_map.items():
        score = sum(1 for kw in keywords if kw in user_input_lower)
        if score > 0:
            scores[crime_type] = score

    if not scores:
        return None, 0

    best_match = max(scores, key=scores.get)
    max_score = scores[best_match]
    # Normalize confidence roughly
    confidence = min(99, 60 + (max_score * 13))
    return best_match, confidence


def display_legal_sections(crime_type):
    # Display applicable BNS and IT Act sections for a crime type.
    if crime_type not in CRIME_LEGAL_MAP:
        print("\n[!] Crime type not found in database.")
        return

    mapping = CRIME_LEGAL_MAP[crime_type]
    crime_display = crime_type.replace("_", " ").upper()

    print(f"  LEGAL SECTIONS APPLICABLE: {crime_display}")

    print("\n BHARATIYA NYAYA SANHITA (BNS) 2023:")
    for sec in mapping["bns"]:
        if sec in BNS_SECTIONS:
            info = BNS_SECTIONS[sec]
            print(f"\n     ▶ BNS Section {sec}: {info['title']}")
            print(f"       {info['description']}")

    print("\n INFORMATION TECHNOLOGY ACT 2000:")
    for sec in mapping["it_act"]:
        if sec in IT_ACT_SECTIONS:
            info = IT_ACT_SECTIONS[sec]
            print(f"\n      IT Act Section {sec}: {info['title']}")
            print(f"       {info['description']}")


def display_emergency_steps(crime_type):
    # Display step-by-step recovery instructions.
    if crime_type not in CRIME_LEGAL_MAP:
        return

    steps = CRIME_LEGAL_MAP[crime_type]["emergency_steps"]
    print(f"\n IMMEDIATE ACTION STEPS (Golden Hour):")
    for i, step in enumerate(steps, 1):
        print(f"   Step {i}: {step}")


def identify_crime_interactive():
    # Main function: take user input and provide legal guidance.
    print("  CRIME IDENTIFICATION & LEGAL GUIDANCE")
    print("\n  Describe what happened to you (in English or Hinglish):")
    print("  Example: 'Mera UPI se paise cut gaye' or 'My account was hacked'")
    print()
    user_input = input("  Your description: ").strip()

    if not user_input:
        print("\n[!] No input provided.")
        return None

    print("\n Analysing your complaint...\n")

    crime_type, confidence = get_crime_type_from_keywords(user_input)

    if not crime_type:
        print("  [!] Could not identify the crime type from your description.")
        print("      Please try using more specific keywords or choose from the list:")
        crime_type = manual_crime_selection()
        confidence = 100
        if not crime_type:
            return None

    crime_display = crime_type.replace("_", " ").title()
    print(f" Crime Identified : {crime_display}")
    print(f" Confidence Score : {confidence}%")

    display_legal_sections(crime_type)
    display_emergency_steps(crime_type)

    print(f"\n EVIDENCE COLLECTION")
    victim_name = input("  Your Name: ").strip()
    victim_phone = input("  Your Phone Number: ").strip()
    incident_date = input("  Date of Incident (DD/MM/YYYY): ").strip()
    txn_id = input("  Transaction ID / Evidence ID (if any): ").strip()
    amount_lost = input("  Amount Lost (₹): ").strip()

    report = {
        "victim_name": victim_name,
        "victim_phone": victim_phone,
        "incident_date": incident_date,
        "crime_type": crime_type,
        "confidence": confidence,
        "user_description": user_input,
        "txn_id": txn_id,
        "amount_lost": amount_lost,
        "bns_sections": CRIME_LEGAL_MAP[crime_type]["bns"],
        "it_act_sections": CRIME_LEGAL_MAP[crime_type]["it_act"],
        "generated_on": datetime.datetime.now().strftime("%d-%m-%Y %H:%M"),
    }

    save = input("\n Generate & save complaint handout? (y/n): ").strip().lower()
    if save == 'y':
        save_complaint_handout(report)

    return report


def manual_crime_selection():
    # Let user manually select crime type from a menu.
    options = list(CRIME_LEGAL_MAP.keys())
    print("\n  Please select the type of crime:")
    for i, crime in enumerate(options, 1):
        print(f"   {i}. {crime.replace('_', ' ').title()}")
    print("   0. Go back")

    try:
        choice = int(input("\n  Enter number: ").strip())
        if choice == 0:
            return None
        if 1 <= choice <= len(options):
            return options[choice - 1]
        else:
            print("  Invalid choice.")
            return None
    except ValueError:
        print("  Invalid input.")
        return None


def save_complaint_handout(report):
    # Save a formatted complaint handout to a .txt file.
    
    os.makedirs("reports", exist_ok=True)

    safe_name = report["victim_name"].replace(" ", "_") if report["victim_name"] else "Unknown"
    filename = f"reports/complaint_{safe_name}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"

    bns_details = []
    for sec in report["bns_sections"]:
        if sec in BNS_SECTIONS:
            bns_details.append(f"  BNS Section {sec}: {BNS_SECTIONS[sec]['title']}")
            bns_details.append(f"  {BNS_SECTIONS[sec]['description']}")

    it_details = []
    for sec in report["it_act_sections"]:
        if sec in IT_ACT_SECTIONS:
            it_details.append(f"  IT Act Sec {sec}: {IT_ACT_SECTIONS[sec]['title']}")
            it_details.append(f"  {IT_ACT_SECTIONS[sec]['description']}")

    handout = f"""
       CYBER CRIME COMPLAINT HANDOUT
       Generated by Cyber Legal Guidance System

VICTIM INFORMATION
  Name          : {report['victim_name']}
  Phone         : {report['victim_phone']}
  Date of Crime : {report['incident_date']}
  Report Date   : {report['generated_on']}

INCIDENT DETAILS
  Crime Type    : {report['crime_type'].replace('_', ' ').upper()}
  Description   : {report['user_description']}
  Amount Lost   : ₹{report['amount_lost']}
  Transaction ID: {report['txn_id']}
  Confidence    : {report['confidence']}%

APPLICABLE LEGAL SECTIONS
BHARATIYA NYAYA SANHITA (BNS) 2023:
{chr(10).join(bns_details)}

INFORMATION TECHNOLOGY ACT 2000:
{chr(10).join(it_details)}

IMMEDIATE STEPS
"""
    steps = CRIME_LEGAL_MAP[report["crime_type"]]["emergency_steps"]
    for i, step in enumerate(steps, 1):
        handout += f"  Step {i}: {step}\n"

    handout += f"""
WHERE TO FILE YOUR COMPLAINT
  1. Online  : https://cybercrime.gov.in
  2. Helpline: 1930 (National Cybercrime Helpline)
  3. Offline : Nearest Cyber Police Station

IMPORTANT DISCLAIMER
  This handout is for informational purposes only.
  Please consult a qualified legal professional for legal advice.
  This system uses BNS 2023 which replaced IPC from July 2024.
"""

    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(handout)
        print(f"\n Complaint handout saved: {filename}")
    except Exception as e:
        print(f"\n  [!] Could not save file: {e}")


def search_bns_section():
    # Search and display a BNS section by number.
    print("\n  Available BNS Sections:", ", ".join(BNS_SECTIONS.keys()))
    sec = input("  Enter BNS Section number: ").strip()
    if sec in BNS_SECTIONS:
        info = BNS_SECTIONS[sec]
        print(f"\n  ▶ BNS Section {sec}: {info['title']}")
        print(f"  {info['description']}")
        print(f"  Related crimes: {', '.join(info['related_crimes'])}")
    else:
        print("  Section not found in database.")


def search_it_act_section():
    # Search and display an IT Act section by number.
    print("\n  Available IT Act Sections:", ", ".join(IT_ACT_SECTIONS.keys()))
    sec = input("  Enter IT Act Section number: ").strip().upper()
    if sec in IT_ACT_SECTIONS:
        info = IT_ACT_SECTIONS[sec]
        print(f"\n IT Act Section {sec}: {info['title']}")
        print(f"  {info['description']}")
        print(f" Related crimes: {', '.join(info['related_crimes'])}")
    else:
        print("Section not found in database.")


def generate_handout_standalone():
    # Generate a complaint handout by manually selecting crime type.
    print("\n  Select crime type for handout generation:")
    crime_type = manual_crime_selection()
    if not crime_type:
        return

    victim_name = input("  Your Name: ").strip()
    victim_phone = input("  Phone Number: ").strip()
    incident_date = input("  Date of Incident (DD/MM/YYYY): ").strip()
    txn_id = input("  Transaction / Evidence ID: ").strip()
    amount_lost = input("  Amount Lost (₹): ").strip()
    description = input("  Brief description: ").strip()

    report = {
        "victim_name": victim_name,
        "victim_phone": victim_phone,
        "incident_date": incident_date,
        "crime_type": crime_type,
        "confidence": 100,
        "user_description": description,
        "txn_id": txn_id,
        "amount_lost": amount_lost,
        "bns_sections": CRIME_LEGAL_MAP[crime_type]["bns"],
        "it_act_sections": CRIME_LEGAL_MAP[crime_type]["it_act"],
        "generated_on": datetime.datetime.now().strftime("%d-%m-%Y %H:%M"),
    }
    save_complaint_handout(report)


def view_past_reports():
    # List and display previously saved complaint reports.
    if not os.path.exists("reports"):
        print("\nNo reports found. No 'reports' directory exists yet.")
        return

    files = [f for f in os.listdir("reports") if f.endswith(".txt")]
    if not files:
        print("\nNo saved reports found.")
        return

    print(f"\n  Found {len(files)} report(s):\n")
    for i, fname in enumerate(files, 1):
        print(f"   {i}. {fname}")

    choice = input("\nEnter number to view (or 0 to go back): ").strip()
    try:
        idx = int(choice)
        if idx == 0:
            return
        if 1 <= idx <= len(files):
            filepath = os.path.join("reports", files[idx - 1])
            with open(filepath, "r", encoding="utf-8") as f:
                print(f.read())
        else:
            print("  Invalid choice.")
    except (ValueError, IOError) as e:
        print(f"  Error: {e}")


def display_emergency_contacts():
    # Display all emergency contacts for cybercrime.
    contacts = {
        "National Cybercrime Helpline": "1930",
        "Cyber Crime Portal (Online FIR)": "https://cybercrime.gov.in",
        "Women Helpline": "181",
        "Police": "100",
        "CERT-In (Data Breach)": "incident@cert-in.org.in",
        "RBI Fraud (Banking)": "14440",
        "SEBI (Investment Fraud)": "1800-266-7575",
        "UIDAI (Aadhaar Misuse)": "1947",
    }

    print("EMERGENCY CONTACTS FOR CYBERCRIME")
    for name, contact in contacts.items():
        print(f"  {name:<35} : {contact}")
    print(" Golden Hour Tip: Report within the FIRST HOUR for")
    print(" maximum chance of fund recovery!\n")

# Program Loop

def main():
    # Main entry point — runs the guidance system loop.
    display_header()

    print("  Welcome! This system helps cybercrime victims understand")
    print("  their legal rights under BNS 2023 and IT Act 2000,")
    print("  and guides them through the complaint process.\n")
    print("  DISCLAIMER: This tool provides legal information only.")
    print("  Please consult a lawyer for legal advice.\n")

    while True:
        display_menu()
        choice = input().strip()

        if choice == "1":
            identify_crime_interactive()

        elif choice == "2":
            search_bns_section()

        elif choice == "3":
            search_it_act_section()

        elif choice == "4":
            generate_handout_standalone()

        elif choice == "5":
            view_past_reports()

        elif choice == "6":
            display_emergency_contacts()

        elif choice == "7":
            print("\nThank you for using the Cyber Legal Guidance System.")
            print("Stay safe online! 🔒\n")
            break

        else:
            print("\n  [!] Invalid choice. Please enter a number between 1 and 7.")

        input("\n  Press Enter to return to menu...")


if __name__ == "__main__":
    main()
