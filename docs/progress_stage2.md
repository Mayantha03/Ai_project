# Stage 2: Progress Review Report

**Course:** Essentials of Artificial Intelligence  
**Institution:** General Sir John Kotelawala Defence University (KDU), Faculty of Computing  
**Project Title:** AI-Powered University Classroom Utilization Optimizer  
**Submission Stage:** Stage 2: Progress Review (Week 8 | Weight: 10%)

---

## 👥 Group Members & Updated Task Contribution

| No. | Index No. | Degree Programme | Name | Primary Responsibility & Updated Tasks |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `D/BIT/24/0044` | Information Technology | **HAID Harshani** | **Project Coordination & Frontend UI:** Developed React 18 Single Page Application, Interactive Leaflet/Google Maps Campus Map component, Student Study Hub UI, and UI notification system. |
| **2** | `D/COE/25/0023` | Computer Engineering | **H D M C Nawarathna** | **Optimization & AI Engine Architecture:** Coded Multi-Objective Genetic Algorithm optimizer, FastAPI REST API microservice endpoints, Spring Boot enterprise bridge, and conflict detection logic. |
| **3** | `D/BIT/24/0069` | Information Technology | **H.M.H.P. Herath** | **Machine Learning & Data Processing:** Preprocessed 2,500 historical attendance session records, trained Random Forest Regressor ($R^2 = 0.9872$), and implemented Explainable AI (XAI) feature reasoning. |
| **4** | `D/BCS/25/0015` | Computer Science | **LSR Gunathunga** | **Database Architecture & System Testing:** Designed MySQL 8.0 schema (14 relational tables), extracted official KDU Intakes 41/42/43 timetable data, and conducted integration testing. |

---

## 1. Updated Project Title & Problem Statement

* **Project Title:** *AI-Powered University Classroom Utilization Optimizer*
* **Target Environment:** General Sir John Kotelawala Defence University (KDU), Faculty of Computing (covering Department of Computer Engineering, Department of Computer Science, Department of Software Engineering, Department of Information Technology, and Department of Computational Mathematics).
* **Updated Problem Statement:**  
  Higher education institutions like KDU rely on manual or static timetabling methods where classrooms are assigned based on fixed official student enrollment numbers rather than true class turnout. Consequently, large lecture halls (e.g. 93-seat halls) are frequently underutilized when actual attendance drops on Mondays/Fridays, while specialized laboratories suffer from overcrowding or scheduling clashes. Furthermore, last-minute room cancellations leave spaces idle due to the lack of dynamic reallocation mechanisms, and students waste valuable free hours searching for vacant study spots. An intelligent, data-driven system is required to forecast attendance, automate zero-conflict master scheduling across multiple intakes, and dynamically optimize room usage within the Faculty of Computing.

---

## 2. Changes Made After Proposal Feedback

1. **Refined Project Scope:** Focused 100% exclusively on the **KDU Faculty of Computing (FOC)** across 5 academic departments (CE, CS, SE, IT, and Data Science & Business Analytics).
2. **Real KDU Timetable Integration:** Expanded the system dataset from sample data to **Official KDU Master Timetables** covering Intakes 41 (Semester VI), 42 (Semester IV), and 43 (Semester II).
3. **Calibrated Campus Geolocation & Floor Allocations:** Extracted exact Google Maps GPS coordinates for all FOC buildings and calibrated walking distances (e.g. FOM Building to FGS Building = 420m / 5 min walk). Calibrated FGS active lecture floors to **3rd Floor (FGS 3-1)** and **4th Floor (FGS 4-3)**.
4. **Added Explainable AI (XAI):** Integrated transparent decision breakdown cards explaining why specific student attendance figures and classrooms were assigned.

---

## 3. Finalized AI Techniques

1. **Supervised Machine Learning (Random Forest Regressor):**  
   Predicts actual student attendance headcount based on enrolled count, day of week, time slot, course type, exam proximity, and weather conditions.  
   *Performance:* $R^2 = 0.9872$ (98.72% Accuracy), $\text{MAE} = 2.16$ students.
2. **Multi-Objective Genetic Algorithm (GA):**  
   Solves NP-hard multi-program timetabling across Intakes 41, 42, and 43 simultaneously. Generates zero-conflict master timetables while maximizing room utilization efficiency.
3. **Multi-Attribute Utility Theory (MAUT) & Content-Based Filtering:**  
   Ranks vacant campus spaces for students during free hours based on proximity, quiet level, AC, and power outlet availability.
4. **Rule-Based MCDM & Dynamic Heuristics:**  
   Evaluates classroom swapping efficiency (+19.4% gain) and executes sub-second emergency room reallocation during equipment failures.

---

## 4. System Architecture & Workflow Diagram

```text
  ┌─────────────────────────────────────────────────────────────────┐
  │                 React 18 + Tailwind UI (Port 3000)               │
  │     (Admin Dashboard • Lecturer Portal • Student Study Hub)     │
  └─────────────────────────────────────────────────────────────────┘
                                   │
                           (REST APIs / JSON)
                                   ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │              Python FastAPI AI Microservice (Port 8000)         │
  │   ├── Random Forest Regressor (Attendance Predictor Model)      │
  │   ├── Multi-Objective Genetic Algorithm (Master Scheduler)      │
  │   ├── MAUT Engine (Study Space Recommender)                     │
  │   └── MCDM Rule Engine (Conflict Checker & Swap Evaluator)       │
  └─────────────────────────────────────────────────────────────────┘
                                   │
                          (Database Persistence)
                                   ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │               Spring Boot Backend & MySQL 8.0 Database          │
  │  (14 Relational Tables: Users, Courses, Rooms, Schedules, etc.) │
  └─────────────────────────────────────────────────────────────────┘
```

---

## 5. Dataset Details

* **Dataset Source:** KDU Historical Attendance Session Logs (`historical_attendance.csv`).
* **Total Sample Size:** 2,500 session records spanning Intakes 41, 42, and 43.
* **Input Features:** `course_code`, `enrolled_students`, `day_of_week`, `time_slot`, `course_type`, `is_exam_near`, `weather`.
* **Target Variable:** `actual_attendance` (actual headcount attended).
* **Train/Test Split:** 80% Training Set (2,000 samples) / 20% Testing Set (500 samples).

---

## 6. GA Design, Search Strategy & Fitness Function

* **Chromosome Structure:** Solution vector representing assigned `(course_id, classroom_id, time_slot_id)`.
* **Population Size:** 30 chromosomes per generation.
* **Evolutionary Epochs:** 40 generations.
* **Operators:** Tournament Selection ($k=3$), Uniform Crossover ($p_c=0.8$), Random Mutation ($p_m=0.05$).
* **Fitness Function Formula:**
  $$\text{Fitness} = \text{UtilizationScore} - \text{HardPenalty} - \text{DistancePenalty}$$
  * **Hard Penalty:** $-1,500$ for physical room double-booking, lecturer clash, or capacity deficit ($\text{Capacity} < \text{Predicted Attendance}$).
  * **Soft Reward:** $+\left(\frac{\text{Predicted Attendance}}{\text{Capacity}} \times 100\right)$ for maximizing space utilization.

---

## 7. Sample Implementation Outputs

### A. AI Attendance Prediction Output (`POST /api/v1/ai/predict-attendance`)
```json
{
  "course_code": "CS22023",
  "enrolled_students": 82,
  "predicted_attendance": 68,
  "predicted_rate_percentage": 82.9,
  "confidence_score": 0.98,
  "model_metrics": {
    "r2_score": 0.9872,
    "mae_students": 2.16
  },
  "explainable_reasons": [
    "Historical trend: Attendance on Fridays is typically lower (-7%).",
    "Early morning 09:00 slot has a slight negative attendance influence (-6%)."
  ]
}
```

### B. Genetic Algorithm Master Schedule Output (`POST /api/v1/ai/optimize-allocations`)
* **Total Courses Scheduled:** 16 Sessions (Intakes 41, 42 & 43)
* **Total Clashes Detected:** 0 Clashes (0%)
* **Average Space Utilization:** 92.4%
* **Best Fitness Score:** 864.2

---

## 8. Problems Faced During Development & Solutions

1. **Non-Linear Turnout Modeling:**  
   *Problem:* Attendance varies non-linearly depending on day and exam proximity.  
   *Solution:* Trained a Scikit-Learn Random Forest Regressor with 100 decision trees, capturing complex non-linear feature interactions without overfitting.
2. **Combinatorial Explosion in Multi-Intake Scheduling:**  
   *Problem:* Scheduling Intakes 41, 42, and 43 simultaneously created an NP-hard search space.  
   *Solution:* Designed a heavily penalizing fitness function ($-1,500$ clash penalty) with elite preservation in the Genetic Algorithm.
3. **Inaccurate Building Distance Estimates:**  
   *Problem:* Initial arbitrary distance estimates did not reflect real KDU walking times.  
   *Solution:* Extracted exact Google Maps GPS coordinates and calibrated FGS walking distance to ~420m (5 min walk).

---

## 9. Remaining Work Before Final Submission (Stage 3 & 4)

- [ ] Perform stress testing across 50+ simultaneous course schedules.
- [ ] Complete final IEEE-style academic project report.
- [ ] Prepare final presentation slides and demo recording.
