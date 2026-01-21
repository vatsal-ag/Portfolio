# Fire Dept. Management System (FDMS)

A lightweight, high-performance Command & Control system built using **Bash** and **Linux Utilities**. This project automates the logistical challenges of emergency response, forensic investigation, and personnel tracking using a SQL-free, flat-file database architecture.


## 🚒 Key Modules

### 1. Smart Dispatch Engine
* **The Challenge:** Manual coordination often leads to delays in identifying the nearest available units during critical incidents.
* **The Action:** Engineered a proximity-based engine using coordinate math to automatically select the closest available station.
* **The Result:** Minimized response latency and ensured efficient resource allocation across multiple regional stations.


### 2. Forensic Arson Analyzer
* **The Challenge:** Standardizing the assessment of forensic evidence from field reports was slow and inconsistent for investigating officers.
* **The Action:** Developed a pattern-matching tool using Boolean logic to scan logs for chemical accelerants (e.g., fuel) and ignition devices (e.g., timers).
* **The Result:** Standardized the risk assessment process by providing instant "High Risk" or "Critical" alerts based on scene evidence.


### 3. Live Asset & Personnel Analytics
* **The Challenge:** Stations lacked a unified, real-time view of the availability and compliance of both personnel and vehicular equipment.
* **The Action:** Built a management dashboard using `sed` and `awk` to quantify performance metrics and attendance from digitized field reports.
* **The Result:** Enabled precise tracking of firefighter reliability and vehicle commission dates within a single, integrated environment.


### 4. Shift Logic & Data Security
* **The Challenge:** Manual attendance tracking and unauthorized data edits often led to inconsistent audit logs and compromised data integrity.
* **The Action:** Implemented a 10-minute "grace period" logic for shift compliance and integrated a password-protected admin override for log corrections.
* **The Result:** Guaranteed 100% data accuracy for performance reviews and automated the monthly log archiving cycle.

---

## 🛠 Tech Stack & Logic
* **Language:** Bash (Shell Scripting)
* **Data Handling:** Flat-File CSV Database (Structured for portability and speed)
* **Core Utilities:**
    * `awk`: Used for column-based data extraction and shift-time calculations.
    * `sed`: Leveraged for real-time, non-interactive database updates.
    * `grep`: Utilized for rapid forensic pattern matching and record retrieval.

---

## 📂 Project Structure
* `fdms.sh`: The primary command-line interface and logic engine.
* `FDMS_Assets.csv`: Unified database containing 12 columns of personnel and equipment data.
* `FDMS_Stations.csv`: Registry of station identifiers and geospatial coordinates.
* `FDMS_Attendance_Records.csv`: Live-updating log of staff shifts and compliance flags.

---

### Prerequisites
* Any Unix-like environment (Linux, macOS, or WSL).
* Standard Linux utilities (`grep`, `awk`, `sed`) installed.

