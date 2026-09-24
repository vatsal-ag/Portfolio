import os

SAMPLE_1_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <rect width="800" height="1000" fill="#fcfbf7"/>
  <rect x="25" y="25" width="750" height="950" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Clinic Header -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="60" height="60" rx="8" fill="#2563eb"/>
    <path d="M 30 15 L 30 45 M 15 30 L 45 30" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <text x="80" y="30" font-family="'Georgia', serif" font-size="24" font-weight="bold" fill="#0f172a">ST. JUDE ORTHOPEDIC &amp; JOINT CLINIC</text>
    <text x="80" y="50" font-family="sans-serif" font-size="13" fill="#64748b">104 Healthcare Blvd, Medical District • Tel: +1 (555) 019-2834</text>
  </g>
  
  <line x1="50" y1="140" x2="750" y2="140" stroke="#0284c7" stroke-width="3"/>

  <!-- Doctor & Patient Details -->
  <g transform="translate(60, 165)" font-family="sans-serif">
    <text x="0" y="15" font-size="14" font-weight="bold" fill="#1e293b">Dr. Robert Miller, M.D. (Ortho)</text>
    <text x="0" y="35" font-size="12" fill="#475569">Reg. No: MED-78491-NY</text>
    
    <text x="450" y="15" font-size="13" fill="#334155">Date: <tspan font-weight="bold" fill="#0f172a">15 Sep 2026</tspan></text>
    <text x="450" y="35" font-size="13" fill="#334155">Prescription ID: <tspan font-weight="bold" fill="#0f172a">RX-84920</tspan></text>
  </g>

  <!-- Patient Box -->
  <rect x="50" y="220" width="700" height="50" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
  <g transform="translate(65, 252)" font-family="sans-serif" font-size="13" fill="#334155">
    <text x="0" y="0">Patient Name: <tspan font-weight="bold" fill="#0f172a">Grandpa Arthur Vance</tspan></text>
    <text x="320" y="0">Age: <tspan font-weight="bold">74 Yrs</tspan></text>
    <text x="440" y="0">Sex: <tspan font-weight="bold">M</tspan></text>
    <text x="530" y="0">Weight: <tspan font-weight="bold">68 Kg</tspan></text>
  </g>

  <!-- Diagnosis -->
  <g transform="translate(60, 310)" font-family="sans-serif">
    <text x="0" y="0" font-size="14" font-weight="bold" fill="#0369a1">Diagnosis / Clinical Impression:</text>
    <text x="240" y="0" font-size="14" font-weight="600" fill="#0f172a">Acute Knee Osteoarthritis with Synovial Inflammation</text>
  </g>

  <!-- Rx Symbol -->
  <g transform="translate(60, 350)">
    <text x="0" y="35" font-family="'Times New Roman', serif" font-size="44" font-weight="bold" font-style="italic" fill="#0284c7">℞</text>
  </g>

  <!-- Handwritten Script Effect for Medications -->
  <g transform="translate(120, 380)" font-family="'Brush Script MT', 'Segoe Script', 'Comic Sans MS', cursive, sans-serif" fill="#1e3a8a">
    <!-- Medicine 1: Combiflam -->
    <text x="0" y="40" font-size="26" font-weight="bold">1. Tab. Combiflam (400mg)  ------------  1 Tab  B.D. (p.c.)</text>
    <text x="30" y="70" font-family="sans-serif" font-size="13" fill="#475569">[Ibuprofen 400mg + Paracetamol 325mg] - 5 days after food</text>

    <!-- Medicine 2: Pantocid 40 -->
    <text x="0" y="140" font-size="26" font-weight="bold">2. Cap. Pantocid 40mg  ---------------  1 Cap  O.D. (a.c.)</text>
    <text x="30" y="170" font-family="sans-serif" font-size="13" fill="#475569">[Pantoprazole 40mg] - Empty stomach 30 mins before breakfast</text>

    <!-- Medicine 3: Shelcal 500 -->
    <text x="0" y="240" font-size="26" font-weight="bold">3. Tab. Shelcal 500  ------------------  1 Tab  O.D. (Night)</text>
    <text x="30" y="270" font-family="sans-serif" font-size="13" fill="#475569">[Calcium 500mg + Vit D3] - 15 days at bedtime after dinner</text>
  </g>

  <!-- Special Clinical Note on Synergy -->
  <rect x="60" y="690" width="680" height="90" rx="8" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
  <g transform="translate(80, 720)" font-family="sans-serif">
    <text x="0" y="0" font-size="13" font-weight="bold" fill="#0369a1">DOCTOR'S DIRECTIVE &amp; SAFETY NOTE:</text>
    <text x="0" y="22" font-size="13" fill="#0f172a">• Pantocid 40 is mandatory to prevent gastritis from NSAID painkiller.</text>
    <text x="0" y="42" font-size="13" fill="#0f172a">• Hot water compression on left knee joint twice daily for 15 minutes. Avoid squatting.</text>
  </g>

  <!-- Doctor Signature -->
  <g transform="translate(520, 850)">
    <path d="M 10 30 Q 50 5 80 40 T 140 20 T 190 35" fill="none" stroke="#1d4ed8" stroke-width="2.5"/>
    <line x1="0" y1="50" x2="200" y2="50" stroke="#94a3b8" stroke-width="1"/>
    <text x="20" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">Dr. Robert Miller, M.D.</text>
    <text x="35" y="86" font-family="sans-serif" font-size="11" fill="#64748b">Senior Orthopedic Surgeon</text>
  </g>

  <!-- HIPAA & IT Act Security Notice at bottom -->
  <rect x="50" y="935" width="700" height="35" rx="4" fill="#f1f5f9"/>
  <text x="70" y="957" font-family="sans-serif" font-size="10" fill="#64748b">CONFIDENTIAL HEALTHCARE RECORD • PROTECTED UNDER HIPAA PRIVACY RULE 45 CFR &amp; IT ACT 2000 (SEC 43A / 72A)</text>
</svg>"""

SAMPLE_2_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <rect width="800" height="1000" fill="#fafaf9"/>
  <rect x="25" y="25" width="750" height="950" rx="12" fill="#ffffff" stroke="#d6d3d1" stroke-width="2"/>
  
  <!-- Header -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="60" height="60" rx="8" fill="#0d9488"/>
    <path d="M 20 30 C 20 20 40 20 40 30 C 40 40 20 45 20 50" stroke="#ffffff" stroke-width="4" fill="none"/>
    <text x="80" y="30" font-family="'Georgia', serif" font-size="24" font-weight="bold" fill="#115e59">METROPOLITAN CHEST &amp; ALLERGY CLINIC</text>
    <text x="80" y="50" font-family="sans-serif" font-size="13" fill="#64748b">Pulmonology &amp; Respiratory Care • Tel: +1 (555) 438-9901</text>
  </g>
  
  <line x1="50" y1="140" x2="750" y2="140" stroke="#0d9488" stroke-width="3"/>

  <!-- Doctor & Patient -->
  <g transform="translate(60, 165)" font-family="sans-serif">
    <text x="0" y="15" font-size="14" font-weight="bold" fill="#1e293b">Dr. Elizabeth Chen, M.D. (Chest Specialist)</text>
    <text x="0" y="35" font-size="12" fill="#475569">Reg. No: PULM-99120-NY</text>
    <text x="450" y="15" font-size="13" fill="#334155">Date: <tspan font-weight="bold" fill="#0f172a">16 Sep 2026</tspan></text>
  </g>

  <!-- Patient Box -->
  <rect x="50" y="220" width="700" height="50" rx="6" fill="#f0fdfa" stroke="#ccfbf1" stroke-width="1"/>
  <g transform="translate(65, 252)" font-family="sans-serif" font-size="13" fill="#334155">
    <text x="0" y="0">Patient Name: <tspan font-weight="bold" fill="#0f172a">Grandpa Arthur Vance</tspan></text>
    <text x="320" y="0">Age: <tspan font-weight="bold">74 Yrs</tspan></text>
    <text x="440" y="0">Sex: <tspan font-weight="bold">M</tspan></text>
  </g>

  <!-- Diagnosis -->
  <g transform="translate(60, 310)" font-family="sans-serif">
    <text x="0" y="0" font-size="14" font-weight="bold" fill="#0f766e">Diagnosis / Findings:</text>
    <text x="180" y="0" font-size="14" font-weight="600" fill="#0f172a">Acute Bacterial Bronchitis with Productive Cough</text>
  </g>

  <g transform="translate(60, 350)">
    <text x="0" y="35" font-family="'Times New Roman', serif" font-size="44" font-weight="bold" font-style="italic" fill="#0d9488">℞</text>
  </g>

  <g transform="translate(120, 380)" font-family="'Brush Script MT', 'Segoe Script', 'Comic Sans MS', cursive, sans-serif" fill="#134e4a">
    <text x="0" y="40" font-size="26" font-weight="bold">1. Tab. Augmentin 625mg  -----------  1 Tab  B.D. (p.c.)</text>
    <text x="30" y="70" font-family="sans-serif" font-size="13" fill="#475569">[Amoxicillin 500mg + Clavulanate 125mg] - 5 days after food</text>

    <text x="0" y="140" font-size="26" font-weight="bold">2. Cap. Darolac Probiotic  -----------  1 Cap  B.D. (2h p.c.)</text>
    <text x="30" y="170" font-family="sans-serif" font-size="13" fill="#475569">[Lactobacillus blend] - Take 2 hours after antibiotic to protect gut flora</text>

    <text x="0" y="240" font-size="26" font-weight="bold">3. Tab. Montair LC  -----------------  1 Tab  O.D. (Bedtime)</text>
    <text x="30" y="270" font-family="sans-serif" font-size="13" fill="#475569">[Montelukast + Levocetirizine] - 7 days at bedtime for cough</text>
  </g>

  <rect x="60" y="690" width="680" height="80" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
  <g transform="translate(80, 720)" font-family="sans-serif">
    <text x="0" y="0" font-size="13" font-weight="bold" fill="#15803d">SAFETY &amp; CARE ADVICE:</text>
    <text x="0" y="22" font-size="13" fill="#0f172a">• Probiotic capsule given to counteract antibiotic-induced gut flora depletion.</text>
    <text x="0" y="42" font-size="13" fill="#0f172a">• Inhale steam twice daily. Avoid cold beverages.</text>
  </g>

  <g transform="translate(520, 850)">
    <path d="M 10 25 Q 40 40 80 15 T 150 30" fill="none" stroke="#0f766e" stroke-width="2.5"/>
    <line x1="0" y1="50" x2="200" y2="50" stroke="#94a3b8" stroke-width="1"/>
    <text x="20" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">Dr. Elizabeth Chen, M.D.</text>
  </g>

  <rect x="50" y="935" width="700" height="35" rx="4" fill="#f1f5f9"/>
  <text x="70" y="957" font-family="sans-serif" font-size="10" fill="#64748b">CONFIDENTIAL HEALTHCARE RECORD • PROTECTED UNDER HIPAA PRIVACY RULE 45 CFR &amp; IT ACT 2000 (SEC 43A / 72A)</text>
</svg>"""

def generate_samples(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "sample-painkiller-synergy.svg"), "w") as f:
        f.write(SAMPLE_1_SVG)
    with open(os.path.join(output_dir, "sample-respiratory-infection.svg"), "w") as f:
        f.write(SAMPLE_2_SVG)
    print("Generated demo prescription SVGs in", output_dir)

if __name__ == "__main__":
    generate_samples("backend/uploads")

BOX_PAN40_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#f8fafc" rx="16"/>
  <!-- Medicine Box 3D Simulation -->
  <rect x="50" y="50" width="500" height="300" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="50" y="50" width="500" height="40" rx="12" fill="#3b82f6"/>
  <text x="70" y="76" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">ALKEM PHARMACEUTICALS</text>
  
  <text x="70" y="160" font-family="'Arial Black', sans-serif" font-size="48" font-weight="900" fill="#1e3a8a">PAN 40</text>
  <text x="70" y="195" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0284c7">Pantoprazole Gastro-resistant Tablets IP</text>
  
  <rect x="70" y="220" width="160" height="40" rx="8" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="90" y="246" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1d4ed8">Each tab: 40 mg</text>
  
  <text x="70" y="300" font-family="sans-serif" font-size="12" fill="#64748b">Rx - To be sold by retail on prescription only. 10 Tablets Strip.</text>
  <circle cx="480" cy="180" r="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="465" y="187" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e40af">40</text>
</svg>"""

BOX_COMBIFLAM_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#fef2f2" rx="16"/>
  <rect x="50" y="50" width="500" height="300" rx="12" fill="#ffffff" stroke="#fca5a5" stroke-width="3"/>
  <rect x="50" y="50" width="500" height="40" rx="12" fill="#dc2626"/>
  <text x="70" y="76" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">SANOFI INDIA</text>
  
  <text x="70" y="160" font-family="'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#991b1b">Combiflam</text>
  <text x="70" y="195" font-family="sans-serif" font-size="17" font-weight="bold" fill="#b91c1c">Ibuprofen (400mg) &amp; Paracetamol (325mg) Tablets IP</text>
  
  <rect x="70" y="220" width="220" height="40" rx="8" fill="#fef2f2" stroke="#fecaca"/>
  <text x="85" y="246" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Fast Relief Pain &amp; Fever</text>
  
  <text x="70" y="300" font-family="sans-serif" font-size="12" fill="#64748b">Schedule H Prescription Drug - Warning: Overdose may be injurious.</text>
</svg>"""

with open("backend/uploads/box-pan40.svg", "w") as f:
    f.write(BOX_PAN40_SVG)
with open("backend/uploads/box-combiflam.svg", "w") as f:
    f.write(BOX_COMBIFLAM_SVG)
print("Generated medicine packaging SVGs")
