# AI-Powered Smart Campus Resource Optimization System

An intelligent, multi-tier university resource management system designed for **Essentials of Artificial Intelligence (Intake 41/42/43)**.  
The system is fully configured with **Official KDU Faculty of Computing Real Timetable Data (Intake 42 Semester IV)** and demonstrates **Machine Learning (Random Forest)**, **Optimization (Genetic Algorithm)**, **Recommendation (Multi-Attribute Utility)**, and **Constraint-Based Conflict Detection**.

---

## 🏛️ System Architecture

```text
React.js Frontend (Port 3000)
       ↓  (REST / JSON)
Python AI Microservice (Port 8000)  ◄──►  Spring Boot Backend (Port 8080)
       ↓                                          ↓
Machine Learning (Random Forest)            MySQL 8.0 Database (Port 3306)
Genetic Algorithm Optimizer
Study Space Recommender
```

---

## 🎓 Integrated Real KDU Campus Data (Intake 42 Semester IV)

* **Real Modules:** `CS22023 Artificial Intelligence`, `CS22012 ADSA`, `CS22993 GPSD`, `SE22013 SPM`, `SE22022 SA`, `COE22032 CIM`, `CM22112 Numerical Methods`, `DL4162 RWS Lab`, `COE22012 ED`, `COE22023 ACA Lab`.
* **Real Classrooms & Halls:** `FGS 3-1` (82 seats), `FOM 4-1` (93 seats), `FOM 4-2` (50 seats), `LT-A` (72 seats), `LT-B` (50 seats), `LT-C` (70 seats), `Com. Eng. Lab` (24 PCs), `CCNA Lab` (29 PCs), `FOM 5th Electronic Lab` (30 seats).
* **Real Lecturers:** Mrs. WJ Samaraweera, Dr. WGCW Kumara, Mrs. SCM De S Sirisuriya, Mr. DH Mudalige, Ms. L Willarachchi.

---

## 🚀 Quickstart Guide (How to Run Everything)

### 1. Start the Python AI Microservice
In a terminal, navigate to `ai-service`:
```bash
cd "C:\Users\ASUS TUF\Desktop\New folder (3)\Semester 04\AI\smart-campus-ai\ai-service"

# Run the AI Microservice (Trained on Real KDU Dataset: R² = 0.9794, MAE = 2.05)
python run_ai_service.py
```
* API Documentation & Swagger UI available at: **`http://localhost:8000/docs`**

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

### 3. Database & Spring Boot Setup (Optional for Full Enterprise Backend)
1. Import `database/schema.sql` and `database/seed_data.sql` into your MySQL 8.0 instance (`smart_campus_db`).
2. Run the Spring Boot application from `backend/`:
```bash
cd "C:\Users\ASUS TUF\Desktop\New folder (3)\Semester 04\AI\smart-campus-ai\backend"
mvn spring-boot:run
```

---

## 🌟 Key Features Demonstration for Academic Review

1. **AI Smart Classroom Allocation & Attendance Prediction:**
   - Select real KDU course **CS22023 (Artificial Intelligence)** with 82 enrolled students.
   - The Random Forest model forecasts true turnout (e.g. 68 students) and allocates the tightest-fitting classroom (`FGS 3-1`).
2. **Global Genetic Timetable Optimizer:**
   - Evolve the Intake 42 master schedule over 40 generations, outputting a complete clash-free schedule with over 86% space efficiency.
3. **Smart Classroom Swapping:**
   - Evaluate swapping `FGS 3-1` and `FOM 4-2` with live utilization gain calculations (+18.4%).
4. **Student Free-Time Study Space Finder:**
   - Real-time proximity-aware study space recommendations for Kasun Bandara (Intake 42 COE).
