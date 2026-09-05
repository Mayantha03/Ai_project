"""
Dataset Generator for Campus Historical Attendance
Simulates 3,000+ realistic lecture and practical sessions for KDU Faculty of Computing.
Modules based on Official KDU Timetables across All Departments:
  - Computer Science / Software Eng / Computer Eng (Intakes 41, 42 & 43)
  - Information Technology & Information Systems (Intake 41 IT/IS)
  - Data Science & Business Analytics (Intakes 41 & 42)
"""

import os
import pandas as pd
import numpy as np

def generate_attendance_dataset(output_path: str = None, n_samples: int = 3000):
    np.random.seed(42)
    
    # Official KDU Courses Across All Departments
    courses = [
        # Intake 42 CS / SE / CE (Sem IV)
        {"code": "CS22023", "name": "Artificial Intelligence", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "CS22012", "name": "Advanced Data Structures & Algorithms", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "CS22993", "name": "Group Project in Software Development", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "SE22013", "name": "Software Project Management", "type": "Lecture", "base_enrolled": 58, "faculty": "Computing"},

        # Intake 41 Information Technology (IT)
        {"code": "IT3103", "name": "Service Oriented Web Programming (SOWP)", "type": "Lecture", "base_enrolled": 89, "faculty": "Computing"},
        {"code": "IT3113", "name": "Cyber Security (CS)", "type": "Lecture", "base_enrolled": 89, "faculty": "Computing"},
        {"code": "IT3123", "name": "Cloud Computing & Virtualization (CC&V)", "type": "Lecture", "base_enrolled": 89, "faculty": "Computing"},
        {"code": "IT3133", "name": "Programming Distributed Components (PDC)", "type": "Lecture", "base_enrolled": 89, "faculty": "Computing"},
        {"code": "IT3143", "name": "Independent Study (IS)", "type": "Lecture", "base_enrolled": 124, "faculty": "Computing"},
        {"code": "IT3153", "name": "Software Quality Assurance (SQA)", "type": "Lecture", "base_enrolled": 124, "faculty": "Computing"},
        {"code": "IT3162", "name": "GIS and Remote Sensing (GIS&RS)", "type": "Lecture", "base_enrolled": 124, "faculty": "Computing"},
        {"code": "IT3182", "name": "Essentials of Artificial Intelligence (EAI)", "type": "Lecture", "base_enrolled": 124, "faculty": "Computing"},

        # Intake 41 Information Systems (IS)
        {"code": "IS3073", "name": "Management Information Systems (MIS)", "type": "Lecture", "base_enrolled": 35, "faculty": "Computing"},
        {"code": "IS3112", "name": "Marketing Management (MM)", "type": "Lecture", "base_enrolled": 35, "faculty": "Computing"},
        {"code": "IS3083", "name": "E-Commerce (EC)", "type": "Lecture", "base_enrolled": 35, "faculty": "Computing"},
        {"code": "IS3093", "name": "Financial Management Concepts (FMC)", "type": "Lecture", "base_enrolled": 35, "faculty": "Computing"},
        {"code": "IS3102", "name": "Organizational Behaviour (OB)", "type": "Lecture", "base_enrolled": 35, "faculty": "Computing"},

        # Data Science Courses
        {"code": "DS22012", "name": "Categorical Data Analysis (CDA)", "type": "Lecture", "base_enrolled": 83, "faculty": "Computing"},
        {"code": "CS3253", "name": "Big Data Analytics (BA)", "type": "Lecture", "base_enrolled": 40, "faculty": "Computing"},
    ]
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    time_slots = ["08:30-10:30", "09:00-11:00", "10:30-12:30", "11:30-14:30", "12:00-13:30", "14:30-16:30"]
    weather_types = ["Sunny", "Cloudy", "Rainy"]
    
    records = []
    
    for i in range(n_samples):
        course = np.random.choice(courses)
        enrolled = int(np.clip(np.random.normal(course["base_enrolled"], 3), 15, 200))
        day = np.random.choice(days, p=[0.22, 0.22, 0.20, 0.20, 0.16])
        slot = np.random.choice(time_slots, p=[0.20, 0.20, 0.20, 0.15, 0.15, 0.10])
        is_exam_near = int(np.random.choice([0, 1], p=[0.82, 0.18]))
        has_assignment_submission = int(np.random.choice([0, 1], p=[0.82, 0.18]))
        weather = np.random.choice(weather_types, p=[0.60, 0.25, 0.15])
        
        # Base attendance rate
        attendance_rate = 0.82
        
        # Factors
        if day in ["Monday", "Friday"]:
            attendance_rate -= 0.07
        if "08:30" in slot or "09:00" in slot:
            attendance_rate -= 0.06
        elif "10:30" in slot or "11:30" in slot:
            attendance_rate += 0.04
            
        if course["type"] == "Lab":
            attendance_rate += 0.12  # Practical Labs have mandatory assessment
            
        if is_exam_near == 1:
            attendance_rate += 0.10  # Pre-exam revision sessions
            
        if has_assignment_submission == 1:
            attendance_rate = 0.97  # Mandatory in-class assignment/quiz evaluation guarantees 95-100% turnout
        elif weather == "Rainy":
            attendance_rate -= 0.05
            
        final_rate = np.clip(attendance_rate + np.random.normal(0, 0.02), 0.40, 0.99)
        actual_attendance = int(np.round(enrolled * final_rate))
        
        records.append({
            "course_code": course["code"],
            "course_name": course["name"],
            "course_type": course["type"],
            "faculty": course["faculty"],
            "enrolled_students": enrolled,
            "day_of_week": day,
            "time_slot": slot,
            "is_exam_near": is_exam_near,
            "has_assignment_submission": has_assignment_submission,
            "weather": weather,
            "attendance_rate": round(final_rate, 4),
            "actual_attendance": actual_attendance
        })
        
    df = pd.DataFrame(records)
    
    if output_path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(base_dir, "historical_attendance.csv")
        
    df.to_csv(output_path, index=False)
    print(f"[+] Generated {len(df)} synthetic KDU historical attendance records -> {output_path}")
    return df

if __name__ == "__main__":
    generate_attendance_dataset()
