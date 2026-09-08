"""
AI Microservice FastAPI Server Entrypoint
Exposes REST endpoints for Attendance Prediction, Genetic Optimization,
Study Space Recommendation, Conflict Detection, and Smart Swapping.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from app.models.attendance_predictor import AttendancePredictor
from app.models.genetic_optimizer import GeneticClassroomOptimizer
from app.models.study_recommender import StudySpaceRecommender
from app.models.conflict_detector import ConflictAndSwapEngine
from app.schemas.ai_schemas import (
    AttendancePredictRequest, AttendancePredictResponse,
    OptimizationRequest, OptimizationResponse,
    StudySpaceRecommendRequest, StudySpaceRecommendResponse,
    SwapEvaluateRequest, SwapEvaluateResponse
)

app = FastAPI(
    title="Smart Campus AI Engine",
    description="Machine Learning, Genetic Optimization & Recommendation API for University Resource Management",
    version="1.0.0"
)

# Enable CORS for Frontend & Backend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core AI Models
print("[*] Initializing AI Microservice Core Models...")
attendance_engine = AttendancePredictor()
study_space_engine = StudySpaceRecommender()
conflict_swap_engine = ConflictAndSwapEngine()
print("[+] AI Models loaded and ready!")

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Smart Campus AI Microservice",
        "models_loaded": {
            "attendance_predictor": "RandomForestRegressor (Scikit-Learn)",
            "timetable_optimizer": "Multi-Objective Genetic Algorithm",
            "study_recommender": "Multi-Attribute Utility Theory (MAUT)",
            "conflict_engine": "Constraint & Rule Evaluator"
        },
        "model_metrics": attendance_engine.metrics
    }

# -------------------------------------------------------------------
# Endpoint 1: Attendance Prediction (Random Forest)
# -------------------------------------------------------------------
@app.post("/api/v1/ai/predict-attendance", response_model=AttendancePredictResponse)
def predict_attendance(request: AttendancePredictRequest):
    try:
        result = attendance_engine.predict(
            enrolled=request.enrolled_students,
            day=request.day_of_week,
            slot=request.time_slot,
            course_type=request.course_type,
            is_exam_near=request.is_exam_near,
            weather=request.weather
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Error: {str(e)}")

# -------------------------------------------------------------------
# Endpoint 2: Timetable & Classroom Allocation (Genetic Algorithm)
# -------------------------------------------------------------------
@app.post("/api/v1/ai/optimize-allocations", response_model=OptimizationResponse)
def optimize_allocations(request: OptimizationRequest):
    try:
        courses_dict = [c.model_dump() for c in request.courses]
        classrooms_dict = [r.model_dump() for r in request.classrooms]
        
        # Step 1: Pre-calculate predicted attendance for courses missing it
        for course in courses_dict:
            if course.get("predicted_attendance") is None:
                pred_res = attendance_engine.predict(
                    enrolled=course["enrolled_students"],
                    day=course["day"],
                    slot=course["time_slot"],
                    course_type="Lab" if course.get("requires_lab") else "Lecture"
                )
                course["predicted_attendance"] = pred_res["predicted_attendance"]

        # Step 2: Run Genetic Algorithm evolution
        optimizer = GeneticClassroomOptimizer(
            population_size=request.population_size or 30,
            generations=request.generations or 40
        )
        optimization_output = optimizer.optimize(courses_dict, classrooms_dict)
        return optimization_output
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization Error: {str(e)}")

# -------------------------------------------------------------------
# Endpoint 3: Study Space Recommendation
# -------------------------------------------------------------------
@app.post("/api/v1/ai/recommend-study-spaces", response_model=StudySpaceRecommendResponse)
def recommend_study_spaces(request: StudySpaceRecommendRequest):
    try:
        spaces_dict = [s.model_dump() for s in request.available_spaces]
        ranked = study_space_engine.recommend(
            student_faculty=request.student_faculty,
            available_spaces=spaces_dict,
            need_quiet=request.need_quiet,
            require_charging=request.require_charging
        )
        return {
            "student_faculty": request.student_faculty,
            "recommended_count": len(ranked),
            "ranked_spaces": ranked
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation Error: {str(e)}")

# -------------------------------------------------------------------
# Endpoint 4: Smart Classroom Swapping
# -------------------------------------------------------------------
@app.post("/api/v1/ai/evaluate-swap", response_model=SwapEvaluateResponse)
def evaluate_swap(request: SwapEvaluateRequest):
    try:
        room_a_dict = request.room_a.model_dump()
        room_b_dict = request.room_b.model_dump()
        result = conflict_swap_engine.evaluate_classroom_swap(
            room_a=room_a_dict,
            students_a=request.students_a,
            room_b=room_b_dict,
            students_b=request.students_b
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Swap Evaluation Error: {str(e)}")

# -------------------------------------------------------------------
# Endpoint 5: Timetable Conflict Detection
# -------------------------------------------------------------------
@app.post("/api/v1/ai/detect-conflicts")
def detect_conflicts(timetable_slots: List[Dict[str, Any]]):
    try:
        conflicts = conflict_swap_engine.detect_timetable_conflicts(timetable_slots)
        return {
            "total_conflicts": len(conflicts),
            "conflicts": conflicts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conflict Detection Error: {str(e)}")
