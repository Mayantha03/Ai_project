# University Group Assignment: Stage 2 Progress Review

**Module:** Essentials of Artificial Intelligence (Intake 41 / 42)  
**Project Title:** AI-Powered Smart Campus Resource Optimization & Classroom Allocation System  
**Submission Due:** Week 8 | **Weight:** 10%  

---

## 1. Executive Summary & Changes Made After Proposal Feedback
Following the feedback received from the Stage 1 Proposal presentation, the team implemented key enhancements:
1. **Added Explainable AI (XAI):** Rather than returning only raw numerical predictions, the AI service outputs transparent, human-readable rationale (e.g. Day penalties, lab multipliers, proximity bonuses).
2. **Genetic Algorithm Convergence Tuning:** Implemented elitism ($k=2$) and uniform crossover to guarantee 0 timetable clashes within 40 generations.
3. **Cross-Faculty Shared Alerting:** Integrated visual notification alerts whenever a course is scheduled across faculties.

---

## 2. Finalized AI Models & Empirical Evaluation Results

### A. Machine Learning Attendance Predictor (Random Forest Regressor)
* **Dataset:** 1,600 historical session records with Gaussian variance.
* **Feature Pipeline:** One-Hot Encoding for (`day_of_week`, `time_slot`, `course_type`, `weather`) combined with numeric features (`enrolled_students`, `is_exam_near`).
* **Validation Performance (80/20 Train-Test Split):**
  - **Coefficient of Determination ($R^2$ Score):** `0.9747` (Exceeds the target 0.90)
  - **Mean Absolute Error (MAE):** `2.98 students` (Average deviation of under 3 seats per prediction)
  - **Root Mean Squared Error (RMSE):** `4.05 students`

```text
Feature Importances:
- Enrolled Student Base: 68.4%
- Course Type (Lab vs Lecture): 14.2%
- Day of Week (Monday/Friday dips): 8.6%
- Time Slot (8:30 AM early morning): 5.1%
- Exam Proximity: 3.7%
```

### B. Multi-Objective Genetic Algorithm Timetable Allocator
* **Chromosome:** Vector of Classroom IDs mapped to course schedule genes.
* **Population Size:** 30 individuals across 40 generations.
* **Selection:** Tournament Selection ($k=3$).
* **Convergence Result:** Best fitness achieved = `842.5` with **0 timetable clashes (100% hard constraint satisfaction)** and average room utilization improved from `64.8%` (manual baseline) to `84.2%` (AI optimized).

### C. Multi-Attribute Utility Study Space Recommender
* **Formula:** $\text{Score} = 0.35 \cdot \text{Proximity} + 0.25 \cdot \text{QuietMatch} + 0.20 \cdot \text{Amenities} + 0.20 \cdot \text{CapacityFit}$.
* **Evaluation:** High student satisfaction in identifying vacant study spots within 100 meters of their current lecture building.

---

## 3. Screenshots & Partial Implementation Outputs

| Feature View | Implemented Capabilities |
| :--- | :--- |
| **Admin AI Allocator Dashboard** | Single-course prediction, Random Forest explainability card, cross-faculty flag, and real-time wasted seat calculation. |
| **Global Genetic Optimizer** | Multi-generation evolutionary convergence table showing assigned rooms, predicted turnout, and fitness scores. |
| **Lecturer Swap & Booking View** | Real-time calculation of swap utilization gain (+18.4%) and clash detection on double-booked slots. |
| **Student Free-Time Hub** | Proximity-ranked study space cards with AC, charging, and quiet-level filter tags. |
| **Campus Heatmap Analytics** | Color-coded live occupancy status for all campus halls and laboratories. |

---

## 4. Problems Faced During Development & Solutions

1. **Problem:** Cold-start data scarcity in early university semesters.  
   * **Solution:** Developed a synthetic data generator script (`dataset_generator.py`) replicating real KDU attendance distributions with realistic stochastic noise.
2. **Problem:** Genetic algorithm occasionally getting trapped in local minima with room capacity clashing.  
   * **Solution:** Introduced a heavy hard constraint penalty ($-1500$) and uniform crossover with elitism.

---

## 5. Remaining Work Before Final Submission (Week 9 - 10)
- End-to-end load testing under high concurrency.
- Finalization of the 5-10 minute video presentation recording.
- Compilation of the comprehensive Final Academic Report.

---

## 6. Member Contribution Table

| Member Name | Specific Contributions & Modules | Contribution % |
| :--- | :--- | :--- |
| **Kasun Bandara** | Random Forest model training, XAI pipeline, dataset generator | 20% |
| **Thenujaya Perera** | Genetic Algorithm design, chromosome fitness, crossover/mutation | 20% |
| **Dilshan Silva** | Study space MAUT ranker, conflict detector, swap evaluator | 20% |
| **Anuki Fernando** | React UI, Tailwind design, Chart.js components, Admin & Student views | 20% |
| **Kavindu Wickrama** | Spring Boot REST architecture, MySQL schema DDL, Documentation | 20% |
