# AI-Powered Smart Campus Resource Optimization System

An intelligent, multi-tier university resource management system designed for **General Sir John Kotelawala Defence University (KDU) Faculty of Computing**.  
The system is fully configured with **Official KDU Faculty of Computing Real Timetable Data (Intake 41 / 42 / 43)** and demonstrates **Machine Learning (Random Forest)**, **Optimization (Genetic Algorithm)**, **Recommendation (KNN + MAUT)**, **Constraint-Based Conflict Detection**, and **Responsible AI Governance**.

---

## 🏛️ System Architecture

```text
React.js Frontend (Port 3000)
       ↓  (REST / JSON)
Python AI Microservice (Port 8000)  ◄──►  Spring Boot Backend (Port 8080)
       ↓                                          ↓
Machine Learning (Random Forest)            MySQL 8.0 Database (Port 3306)
Multi-Constraint Genetic Algorithm
KNN + MAUT Study Space Recommender
Conflict & Emergency Swapping Engine
```

---

## 🎓 Integrated Real KDU Campus Data (Intake 41 / 42 / 43)

* **Real Modules:** `CS22023 Artificial Intelligence`, `CS22012 ADSA`, `CS22993 GPSD`, `SE22013 SPM`, `IT3103 SOWP`, `IT3113 Cyber Security`, `IT3153 SQA`, `IS3073 MIS`, `DS22012 CDA`.
* **Real Classrooms & Halls:** `FGS 3-1` (82 seats), `FOM 4-1` (93 seats), `FOM 4-2` (124 seats), `FOM Roof Top` (43 seats), `Suranimala LT-B` (50 seats), `Suranimala LT-C` (95 seats), `LT-A` (72 seats), `LT-B` (50 seats), `LT-C` (70 seats), `Com. Eng. Lab` (24 PCs), `CCNA Lab` (40 PCs).
* **Real Lecturers & Intakes:** Intake 41 (Sem VI), Intake 42 (Sem IV), Intake 43 (Sem II).

---

## 🚀 Quickstart Guide (How to Run Everything)

### 1. Start the Python AI Microservice
In a terminal, navigate to `ai-service`:
```bash
cd "C:\Users\ASUS TUF\Desktop\New folder (3)\Semester 04\AI\smart-campus-ai\ai-service"

# Run the AI Microservice (Trained on 3,000 KDU Historical Records: R² = 0.9872, MAE = 2.16)
python run_ai_service.py
```
* API Documentation & Interactive Swagger UI: **`http://localhost:8000/docs`**

#### Exposed AI Service REST Endpoints:
1. `POST /api/v1/ai/predict-attendance` - Random Forest Regressor & XAI Feature Importances
2. `POST /api/v1/ai/optimize-allocations` - Multi-Constraint Genetic Algorithm (Room, Lecturer & Batch Clashes)
3. `POST /api/v1/ai/recommend-study-spaces` - KNN Distance + MAUT Utility Study Space Ranking
4. `POST /api/v1/ai/evaluate-swap` - Smart Classroom Swap Utilization Gain Evaluator
5. `POST /api/v1/ai/detect-conflicts` - Multi-Constraint Timetable Conflict Inspector
6. `POST /api/v1/ai/emergency-reallocate` - Automated Failover Room Reallocation Engine

---

### 2. Start the Modern React Frontend
In a separate terminal, navigate to `frontend`:
```bash
cd "C:\Users\ASUS TUF\Desktop\New folder (3)\Semester 04\AI\smart-campus-ai\frontend"

# Start the Vite Development Server
npm run dev
```
* Access the interactive Web Application at: **`http://localhost:3000`**

---

### 3. Database & Spring Boot Setup (Optional Enterprise Backend)
1. Import `database/schema.sql` and `database/seed_data.sql` into your MySQL 8.0 instance (`smart_campus_db`).
2. Run the Spring Boot application from `backend/`:
```bash
cd "C:\Users\ASUS TUF\Desktop\New folder (3)\Semester 04\AI\smart-campus-ai\backend"
mvn spring-boot:run
```

---

## 🛡️ Responsible AI & Governance Framework

- **Human-in-the-Loop Oversight:** AI system provides advisory recommendations; authorized administrators retain final operational authority.
- **Data Protection:** No personally identifiable information (PII) processed by ML models.
- **Manual Override & Appeals Log:** Interactive logging mechanism for administrative override tracking.
- **Explainable AI (XAI):** Visual feature importance progress bars breaking down ML attendance predictions.

