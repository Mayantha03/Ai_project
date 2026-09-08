"""
Conflict Detection, Smart Swapping, and Emergency Reallocation Engine
Provides rule and constraint-based supporting intelligence for campus operations.
"""

from typing import List, Dict, Any, Tuple

class ConflictAndSwapEngine:
    def __init__(self):
        pass

    def detect_timetable_conflicts(self, timetable_slots: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Scans timetable slots for:
        1. Room Clashes (same room, day, and time)
        2. Lecturer Clashes (same lecturer scheduled in two places simultaneously)
        3. Capacity Violations (enrolled/predicted attendance > room capacity)
        """
        conflicts = []
        room_usage = {}
        lecturer_usage = {}
        
        for slot in timetable_slots:
            slot_id = slot.get("id", "N/A")
            room_code = slot.get("room_code")
            lecturer_id = slot.get("lecturer_id")
            day = slot.get("day")
            time_slot = slot.get("time_slot")
            enrolled = slot.get("enrolled_students", 0)
            capacity = slot.get("room_capacity", 100)
            
            time_key = (day, time_slot)
            
            # Check Room Clash
            room_key = (room_code, day, time_slot)
            if room_key in room_usage:
                conflicts.append({
                    "type": "ROOM_DOUBLE_BOOKING",
                    "severity": "HIGH",
                    "message": f"Classroom '{room_code}' is double-booked on {day} ({time_slot}) between '{slot.get('course_code')}' and '{room_usage[room_key]}'.",
                    "affected_courses": [slot.get("course_code"), room_usage[room_key]],
                    "suggested_action": "Trigger AI Allocation to reassign one course to an available room."
                })
            else:
                room_usage[room_key] = slot.get("course_code")
                
            # Check Lecturer Clash
            if lecturer_id:
                lec_key = (lecturer_id, day, time_slot)
                if lec_key in lecturer_usage:
                    conflicts.append({
                        "type": "LECTURER_SCHEDULE_CLASH",
                        "severity": "HIGH",
                        "message": f"Lecturer {lecturer_id} has overlapping classes on {day} ({time_slot}).",
                        "affected_courses": [slot.get("course_code"), lecturer_usage[lec_key]],
                        "suggested_action": "Reschedule time slot for one course section."
                    })
                else:
                    lecturer_usage[lec_key] = slot.get("course_code")
                    
            # Check Capacity Overflow
            if enrolled > capacity:
                deficit = enrolled - capacity
                conflicts.append({
                    "type": "CAPACITY_OVERFLOW",
                    "severity": "MEDIUM",
                    "message": f"Course '{slot.get('course_code')}' has {enrolled} students assigned to '{room_code}' (Capacity: {capacity}). Deficit: {deficit} seats.",
                    "affected_courses": [slot.get("course_code")],
                    "suggested_action": "Perform Smart Classroom Swap or upgrade to an Auditorium."
                })
                
        return conflicts

    def evaluate_classroom_swap(self, 
                                room_a: Dict[str, Any], 
                                students_a: int, 
                                room_b: Dict[str, Any], 
                                students_b: int) -> Dict[str, Any]:
        """
        Evaluates whether exchanging Room A and Room B improves space utilization.
        """
        cap_a = room_a["capacity"]
        cap_b = room_b["capacity"]
        
        # Current individual & average utilization
        curr_util_a = (students_a / cap_a) * 100
        curr_util_b = (students_b / cap_b) * 100
        curr_avg_util = round((curr_util_a + curr_util_b) / 2, 2)
        
        # Check if swapped assignments fit capacities
        can_fit = (students_b <= cap_a) and (students_a <= cap_b)
        
        if not can_fit:
            return {
                "is_swap_recommended": False,
                "current_avg_utilization": curr_avg_util,
                "swapped_avg_utilization": 0.0,
                "utilization_gain": 0.0,
                "message": "Swap impossible: One or both classes exceed destination room capacity."
            }
            
        swap_util_a = (students_b / cap_a) * 100
        swap_util_b = (students_a / cap_b) * 100
        swap_avg_util = round((swap_util_a + swap_util_b) / 2, 2)
        gain = round(swap_avg_util - curr_avg_util, 2)
        
        is_beneficial = gain > 5.0  # Meaningful efficiency boost
        
        reasons = []
        if is_beneficial:
            reasons.append(f"Improves average campus utilization by +{gain}%.")
            reasons.append(f"Room '{room_a['room_code']}' utilization improves from {round(curr_util_a,1)}% to {round(swap_util_a,1)}%.")
            reasons.append(f"Room '{room_b['room_code']}' utilization improves from {round(curr_util_b,1)}% to {round(swap_util_b,1)}%.")
        else:
            reasons.append("Current classroom assignments are already optimal.")
            
        return {
            "is_swap_recommended": is_beneficial,
            "current_avg_utilization": curr_avg_util,
            "swapped_avg_utilization": swap_avg_util,
            "utilization_gain": gain,
            "reasons": reasons
        }

    def emergency_reallocate(self, 
                             damaged_room_code: str, 
                             course_info: Dict[str, Any], 
                             available_rooms: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Fast heuristic fallback when a classroom suffers sudden maintenance/failure.
        """
        required_seats = course_info.get("predicted_attendance", course_info.get("enrolled_students", 50))
        requires_lab = course_info.get("requires_lab", False)
        
        # Filter matching rooms
        candidates = []
        for r in available_rooms:
            if r["room_code"] == damaged_room_code:
                continue
            if requires_lab and not r.get("is_lab", False):
                continue
            if r["capacity"] >= required_seats:
                utilization = round((required_seats / r["capacity"]) * 100, 1)
                wasted = r["capacity"] - required_seats
                candidates.append((r, utilization, wasted))
                
        if not candidates:
            return {
                "success": False,
                "allocated_room": None,
                "message": "No emergency vacant room found meeting capacity requirements."
            }
            
        # Select room with lowest wasted seats (tightest fit)
        candidates.sort(key=lambda item: item[2])
        best_room, util, _ = candidates[0]
        
        return {
            "success": True,
            "damaged_room": damaged_room_code,
            "allocated_room": best_room,
            "utilization_percentage": util,
            "message": f"Emergency reallocation successful: Course moved to '{best_room['room_code']}' ({best_room['room_name']})."
        }
