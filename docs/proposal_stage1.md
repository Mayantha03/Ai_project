# University Group Assignment: Stage 1 Proposal Submission

**Module:** Essentials of Artificial Intelligence (Intake 41 / 42)  
**Project Title:** AI-Powered Smart Campus Resource Optimization & Classroom Allocation System  
**Submission Due:** Week 4 | **Weight:** 10%  

---

## 1. Group Information & Degree Programmes

| Member Name | Student Registration No. | Degree Programme | Role / Work Allocation |
| :--- | :--- | :--- | :--- |
| **Kasun Bandara** | D-COE-25-0023 | BSc (Hons) in Computer Engineering | AI Core: Random Forest Attendance Predictor |
| **Thenujaya Perera** | D-COE-25-0015 | BSc (Hons) in Computer Engineering | AI Core: Genetic Algorithm Timetable Optimizer |
| **Dilshan Silva** | D-CS-25-0017 | BSc (Hons) in Computer Science | AI Core: Study Space Recommender & Conflict Engine |
| **Anuki Fernando** | D-SE-25-0019 | BSc (Hons) in Software Engineering | Frontend UI & Interactive Analytics Dashboard |
| **Kavindu Wickrama** | D-IS-25-0021 | BSc (Hons) in Information Systems | Backend API, Database Architecture & Documentation |

---

## 2. Background of the Selected Problem

Universities like General Sir John Kotelawala Defence University (KDU) manage diverse academic facilities across multiple faculties (Faculty of Computing, Faculty of Engineering, Faculty of Management, and Central Library). However, traditional campus resource scheduling is executed via manual or static timetable methods that suffer from severe operational inefficiencies:
- **Discrepancy between Enrollment and Actual Turnout:** Standard timetables allocate 150-seat lecture halls based strictly on registered student counts (e.g., 120 students), ignoring historical attendance drops on Friday or 8:30 AM slots (where actual turnout may only be 70 students). This wastes electrical power, air conditioning, and physical space.
- **Cross-Faculty Room Silos:** While the Computing Faculty experiences severe hall shortages for large classes, Engineering auditoriums often remain vacant during identical time slots due to a lack of dynamic cross-faculty space sharing.
- **Wasted Student Free Hours:** Students often face 2 to 4-hour gaps between lectures and wander in corridors, canteens, or under trees because there is no automated system to recommend nearest vacant quiet study areas.
- **Slow Emergency Reaction:** When a classroom suffers sudden maintenance or AC failure, manual rescheduling causes significant administrative delay and lecture cancellations.

---

## 3. Problem Statement

Manual and static timetable allocation leads to significant classroom underutilization, timetable clashes, cross-faculty resource wastage, and an inability to predict true student attendance or provide real-time study space guidance to students.

---

## 4. Objectives of the Proposed AI Solution

1. **Predictive Attendance Forecasting:** Train a Machine Learning ensemble model (Random Forest) capable of predicting actual session attendance with $R^2 \ge 0.90$ using historical turnout factors.
2. **Genetic Timetable Optimization:** Formulate a Multi-Objective Genetic Algorithm to assign classrooms while minimizing wasted seats, eliminating double-bookings, and minimizing lecturer walking distances.
3. **Cross-Faculty Space Sharing:** Automatically identify and recommend unused spaces across faculty boundaries to eliminate space bottlenecks.
4. **Personalized Free-Time Study Recommender:** Provide students with multi-attribute ranked study area recommendations during free periods based on proximity, quiet level, and power outlets.
5. **Real-time Conflict Detection & Smart Swapping:** Detect room congestion and evaluate whether swapping two classes produces a net utilization gain.

---

## 5. Target Users

- **University Administrators:** Execute global timetable optimization, review cross-faculty sharing suggestions, and monitor campus capacity heatmaps.
- **Lecturers:** View personalized schedules, evaluate classroom swaps, report cancellations, and book rooms with automated clash detection.
- **Students:** View daily timetables, receive real-time room change alerts, find vacant classrooms, and discover nearby study spaces during free periods.

---

## 6. Proposed AI Concepts & Techniques

| AI Technique | Application in System | Justification |
| :--- | :--- | :--- |
| **1. Random Forest Regressor (Machine Learning)** | Attendance Prediction | Excels at capturing non-linear interactions (e.g., Friday mornings vs. practical lab boosts) without overfitting. |
| **2. Multi-Objective Genetic Algorithm (Optimization)** | Timetable & Classroom Allocation | Solves NP-hard combinatorial scheduling by evolving a population of room assignments against hard & soft constraints. |
| **3. Multi-Attribute Utility Theory / Content-Based Engine** | Study Space Recommendation | Dynamically ranks vacant study spaces using proximity weights, quiet preferences, and available seat headroom. |
| **4. Rule-Based Constraint Satisfaction** | Conflict Detection & Smart Swapping | Instant evaluation of double-booking, capacity deficits, and swap utilization gains. |

---

## 7. Expected System Inputs & Outputs

- **Inputs:** Course ID, Enrolled Count, Session Type (Lecture/Lab), Day, Time Slot, Exam Proximity, Room Capacities, Facility Amenities (AC, Projector, Lab PCs), Student Location.
- **Outputs:** Predicted Attendance Count, Optimized Classroom Assignment, Space Utilization Score (%), Cross-Faculty Notification, Ranked Study Spaces, Conflict Alerts.

---

## 8. Proposed Tools & Technologies

- **AI Microservice:** Python 3.10+, Scikit-Learn, Pandas, NumPy, FastAPI.
- **Enterprise Backend:** Spring Boot 3, Java 17, Spring Data JPA, Spring Security (JWT), WebClient.
- **Database:** MySQL 8.0 Relational Database.
- **Frontend SPA:** React 18, Vite, Tailwind CSS, Lucide Icons, Chart.js.

---

## 9. Initial System Workflow

```text
[Historical Campus Data] ──► [Random Forest ML Model] ──► [Predicted Attendance]
                                                                │
[Course Requirements + Classrooms] ────────────────────────────►▼
                                                     [Genetic Algorithm Optimizer]
                                                                │
                                            ┌───────────────────┴───────────────────┐
                                            ▼                                       ▼
                                [Optimized Timetable]                   [Cross-Faculty Sharing Alert]
                                            │
                                            ▼
                               [Student Study Space Engine] ──► [Ranked Study Pods]
```

---

## 10. 10-Week Timeline & Gantt Milestones

| Week | Milestone / Activity | Deliverable |
| :--- | :--- | :--- |
| **Week 1-2** | Problem Analysis, Architecture Design & MySQL Schema | System Architecture Document |
| **Week 3-4** | Synthetic Data Generation & AI Model Training (Random Forest + GA) | **Stage 1: Proposal Submission (10%)** |
| **Week 5-6** | Spring Boot REST API & JWT Security Implementation | Backend Service Endpoints |
| **Week 7-8** | React + Tailwind Frontend Integration & Component Testing | **Stage 2: Progress Review (10%)** |
| **Week 9** | End-to-End System Testing, Ethical Impact & Edge-case Optimization | Test Evaluation Report |
| **Week 10** | Final Report Writing, Presentation Slides & Demo Video | **Stage 3: Final Submission (30%)** |

---

## 11. References
1. Burke, E. K., et al. (2007). *A survey of search methodologies and automated system approaches for university timetabling.* Journal of Scheduling.
2. Breiman, L. (2001). *Random Forests.* Machine Learning, 45(1), 5-32.
3. Deb, K. (2001). *Multi-Objective Optimization using Evolutionary Algorithms.* John Wiley & Sons.
