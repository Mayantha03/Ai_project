"""
Pydantic Schemas for AI Microservice Request & Response Validation
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- 1. Attendance Prediction Schemas ---
class AttendancePredictRequest(BaseModel):
    enrolled_students: int = Field(..., ge=1, le=500, description="Total enrolled students in course")
    day_of_week: str = Field(..., description="Day (e.g., Monday)")
    time_slot: str = Field(..., description="Time slot (e.g., 08:30-10:30)")
    course_type: str = Field(default="Lecture", description="Lecture, Lab, or Tutorial")
    is_exam_near: int = Field(default=0, description="1 if within 2 weeks of exams, 0 otherwise")
    has_assignment_submission: int = Field(default=0, description="1 if assignment submission/quiz today, 0 otherwise")
    weather: str = Field(default="Sunny", description="Sunny, Cloudy, or Rainy")

class AttendancePredictResponse(BaseModel):
    enrolled_students: int
    predicted_attendance: int
    predicted_rate_percentage: float
    confidence_score: float
    model_metrics: Dict[str, Any]
    explainable_reasons: List[str]

# --- 2. Genetic Algorithm Optimization Schemas ---
class CourseItem(BaseModel):
    course_code: str
    course_name: str
    faculty: str
    enrolled_students: int
    predicted_attendance: Optional[int] = None
    day: str
    time_slot: str
    requires_lab: bool = False
    requires_ac: bool = True

class ClassroomItem(BaseModel):
    room_code: str
    room_name: str
    faculty: str
    capacity: int
    is_lab: bool = False
    has_ac: bool = True

class OptimizationRequest(BaseModel):
    courses: List[CourseItem]
    classrooms: List[ClassroomItem]
    generations: Optional[int] = 40
    population_size: Optional[int] = 30

class AllocationResult(BaseModel):
    course_code: str
    course_name: str
    faculty: str
    day: str
    time_slot: str
    enrolled_students: int
    predicted_attendance: int
    assigned_room: str
    room_name: Optional[str]
    room_capacity: int
    utilization_percentage: float
    is_cross_faculty: bool
    has_clash: bool
    ai_reasons: List[str]

class OptimizationResponse(BaseModel):
    total_courses: int
    total_clashes: int
    best_fitness_score: float
    fitness_convergence: List[float]
    allocations: List[AllocationResult]

# --- 3. Study Space Recommendation Schemas ---
class StudySpaceItem(BaseModel):
    room_code: str
    room_name: str
    faculty: str
    building: str
    quiet_level: str = "MODERATE"
    capacity: int = 30
    has_ac: bool = True
    has_charging_ports: bool = True
    has_wifi: bool = True

class StudySpaceRecommendRequest(BaseModel):
    student_faculty: str
    available_spaces: List[StudySpaceItem]
    need_quiet: bool = True
    require_charging: bool = True

class StudySpaceRecommendResponse(BaseModel):
    student_faculty: str
    recommended_count: int
    ranked_spaces: List[Dict[str, Any]]

# --- 4. Conflict & Smart Swapping Schemas ---
class SwapEvaluateRequest(BaseModel):
    room_a: ClassroomItem
    students_a: int
    room_b: ClassroomItem
    students_b: int

class SwapEvaluateResponse(BaseModel):
    is_swap_recommended: bool
    current_avg_utilization: float
    swapped_avg_utilization: float
    utilization_gain: float
    reasons: List[str]
