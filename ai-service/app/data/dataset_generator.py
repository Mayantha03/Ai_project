"""
Dataset Generator for Campus Historical Attendance
Simulates 1,600+ realistic lecture and practical sessions for KDU Faculty of Computing.
Modules based on Official KDU Intake 42 (Semester IV) Timetable.
"""

import os
import pandas as pd
import numpy as np

def generate_attendance_dataset(output_path: str = None, n_samples: int = 1600):
    np.random.seed(42)
    
    # Official KDU Intake 42 Courses (Semester IV)
    courses = [
        {"code": "CS22023", "name": "Artificial Intelligence", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "CS22012", "name": "Advanced Data Structures & Algorithms", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "CS22993", "name": "Group Project in Software Development", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "SE22013", "name": "Software Project Management", "type": "Lecture", "base_enrolled": 58, "faculty": "Computing"},
        {"code": "SE22022", "name": "Software Architecture", "type": "Lecture", "base_enrolled": 58, "faculty": "Computing"},
        {"code": "COE22032", "name": "Computer Interfacing & Microprocessors", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "CM22112", "name": "Numerical Methods", "type": "Lecture", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "DL4162", "name": "Research Writing Skills", "type": "Lab", "base_enrolled": 82, "faculty": "Computing"},
        {"code": "COE22012", "name": "Engineering Drawing", "type": "Lecture", "base_enrolled": 24, "faculty": "Computing"},
        {"code": "COE22023", "name": "Advanced Computer Architecture", "type": "Lab", "base_enrolled": 24, "faculty": "Computing"},
    ]
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    time_slots = ["08:30-10:30", "09:00-10:30", "10:30-12:30", "12:00-13:30", "13:30-15:30", "14:00-15:30"]
    weather_types = ["Sunny", "Cloudy", "Rainy"]
    
    records = []
    
    for i in range(n_samples):
        course = np.random.choice(courses)
        enrolled = int(np.clip(np.random.normal(course["base_enrolled"], 3), 15, 120))
        day = np.random.choice(days, p=[0.22, 0.22, 0.20, 0.20, 0.16])
        slot = np.random.choice(time_slots, p=[0.20, 0.20, 0.20, 0.15, 0.15, 0.10])
        is_exam_near = int(np.random.choice([0, 1], p=[0.82, 0.18]))
        weather = np.random.choice(weather_types, p=[0.60, 0.25, 0.15])
        
        # Base attendance rate
        attendance_rate = 0.82
        
        # Factors
        if day in ["Monday", "Friday"]:
            attendance_rate -= 0.07
        if "08:30" in slot or "09:00" in slot:
            attendance_rate -= 0.06
        elif "10:30" in slot:
            attendance_rate += 0.04
            
        if course["type"] == "Lab":
            attendance_rate += 0.12  # Practical Labs have mandatory assessment
            
        if is_exam_near == 1:
            attendance_rate += 0.10  # Pre-exam revision sessions
            
        if weather == "Rainy":
            attendance_rate -= 0.05
            
        final_rate = np.clip(attendance_rate + np.random.normal(0, 0.03), 0.40, 0.98)
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
