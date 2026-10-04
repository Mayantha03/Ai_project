"""
AI Concept 2: Multi-Objective Genetic Algorithm Classroom Allocation Optimizer
Formulates classroom and timetable allocation as a constrained optimization problem.
Uses Population evolution, Tournament Selection, Uniform Crossover, and Mutation.
"""

import random
import copy
from typing import List, Dict, Any

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
SLOTS_2_CREDIT = ["08:30-10:30", "10:30-12:30", "13:00-15:00", "15:00-17:00"]
SLOTS_3_CREDIT = ["08:30-11:30", "13:00-16:00"]

class GeneticClassroomOptimizer:
    def __init__(self, 
                 population_size: int = 40, 
                 generations: int = 50, 
                 mutation_rate: float = 0.12, 
                 tournament_size: int = 3):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.tournament_size = tournament_size

    def _calculate_fitness(self, chromosome: List[Dict[str, Any]], classrooms: List[Dict[str, Any]]) -> float:
        """
        Evaluates chromosome fitness based on hard penalties (room, lecturer, batch clashes) and soft objective rewards.
        """
        room_map = {r["room_code"]: r for r in classrooms}
        fitness = 0.0
        
        # Track double-bookings across rooms, lecturers, and student batches
        booked_room_slots = set()
        booked_lecturer_slots = set()
        booked_batch_slots = set()
        
        for gene in chromosome:
            course = gene["course"]
            assigned_room_code = gene["assigned_room"]
            day = gene.get("assigned_day", course.get("day", "Monday"))
            slot = gene.get("assigned_time_slot", course.get("time_slot", "08:30-10:30"))
            lecturer = course.get("lecturer_id") or course.get("lecturer_name")
            batch = course.get("intake") or course.get("degree_program") or course.get("course_code")
            pred_attendance = course.get("predicted_attendance", course["enrolled_students"])
            
            room = room_map.get(assigned_room_code)
            if not room:
                fitness -= 1000
                continue
                
            room_slot_key = (assigned_room_code, day, slot)
            
            # --- Hard Constraint 1A: No Room Double Booking in the same slot ---
            if room_slot_key in booked_room_slots:
                fitness -= 1500  # Severe penalty for room clash
            else:
                booked_room_slots.add(room_slot_key)
                
            # --- Hard Constraint 1B: No Lecturer Double Booking in the same slot ---
            if lecturer:
                lec_slot_key = (lecturer, day, slot)
                if lec_slot_key in booked_lecturer_slots:
                    fitness -= 1500  # Severe penalty for lecturer clash
                else:
                    booked_lecturer_slots.add(lec_slot_key)

            # --- Hard Constraint 1C: No Student Batch/Intake Double Booking in the same slot ---
            if batch:
                batch_slot_key = (batch, day, slot)
                if batch_slot_key in booked_batch_slots:
                    fitness -= 1500  # Severe penalty for batch clash
                else:
                    booked_batch_slots.add(batch_slot_key)
                
            # --- Hard Constraint 2: Room Capacity >= Predicted Attendance ---
            if room["capacity"] < pred_attendance:
                capacity_deficit = pred_attendance - room["capacity"]
                fitness -= (1000 + capacity_deficit * 20)
            else:
                # --- Soft Objective 1: Maximize Space Utilization Rate (0 to 100) ---
                utilization = (pred_attendance / room["capacity"]) * 100
                fitness += (utilization * 1.5)
                
                # Bonus if capacity fit is tight (low wasted seats)
                wasted_seats = room["capacity"] - pred_attendance
                if wasted_seats <= 15:
                    fitness += 30
                elif wasted_seats <= 30:
                    fitness += 15
                    
            # --- Hard Constraint 3: Practical Lab Requirements ---
            if course.get("requires_lab", False):
                if room.get("is_lab", False):
                    fitness += 50
                else:
                    fitness -= 1200  # Hard penalty: Lab course placed in standard hall
            else:
                # Prefer not to waste dedicated computer/hardware labs for regular lectures
                if room.get("is_lab", False):
                    fitness -= 80
                    
            # --- Soft Objective 2: Building Proximity & Faculty Alignment ---
            if room.get("faculty") == course.get("faculty"):
                fitness += 35  # Home faculty building
            else:
                fitness += 10  # Cross-faculty sharing
                
            # --- Soft Objective 3: AC Requirements ---
            if course.get("requires_ac", True) and room.get("has_ac", True):
                fitness += 15
                
        return fitness

    def _create_individual(self, courses: List[Dict[str, Any]], classrooms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        individual = []
        for course in courses:
            # Filter candidate rooms roughly matching lab constraint if possible
            req_lab = course.get("requires_lab", False)
            matching_rooms = [r for r in classrooms if r.get("is_lab", False) == req_lab]
            if not matching_rooms:
                matching_rooms = classrooms
                
            chosen_room = random.choice(matching_rooms)["room_code"]
            credits = course.get("credits", 2)
            slots = SLOTS_3_CREDIT if credits >= 3 else SLOTS_2_CREDIT
            chosen_day = random.choice(DAYS)
            chosen_slot = random.choice(slots)
            
            individual.append({
                "course": course,
                "assigned_room": chosen_room,
                "assigned_day": chosen_day,
                "assigned_time_slot": chosen_slot
            })
        return individual

    def _crossover(self, parent1: List[Dict[str, Any]], parent2: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Uniform Crossover between two parent chromosomes"""
        child = []
        for g1, g2 in zip(parent1, parent2):
            if random.random() < 0.5:
                child.append(copy.deepcopy(g1))
            else:
                child.append(copy.deepcopy(g2))
        return child

    def _mutate(self, chromosome: List[Dict[str, Any]], classrooms: List[Dict[str, Any]]):
        """Random Gene Room Swap Mutation"""
        for gene in chromosome:
            if random.random() < self.mutation_rate:
                req_lab = gene["course"].get("requires_lab", False)
                matching = [r for r in classrooms if r.get("is_lab", False) == req_lab]
                if not matching:
                    matching = classrooms
                gene["assigned_room"] = random.choice(matching)["room_code"]
            
            if random.random() < self.mutation_rate:
                gene["assigned_day"] = random.choice(DAYS)
                credits = gene["course"].get("credits", 2)
                slots = SLOTS_3_CREDIT if credits >= 3 else SLOTS_2_CREDIT
                gene["assigned_time_slot"] = random.choice(slots)

    def _tournament_selection(self, population: List[List[Dict[str, Any]]], fitnesses: List[float]) -> List[Dict[str, Any]]:
        selected_indices = random.sample(range(len(population)), self.tournament_size)
        best_idx = max(selected_indices, key=lambda idx: fitnesses[idx])
        return copy.deepcopy(population[best_idx])

    def optimize(self, courses: List[Dict[str, Any]], classrooms: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes Genetic Algorithm evolution.
        Returns optimized schedule, fitness history, and explainability reasoning.
        """
        if not courses or not classrooms:
            return {"optimized_allocations": [], "fitness": 0, "clashes_resolved": True}

        # Initialize Population
        population = [self._create_individual(courses, classrooms) for _ in range(self.population_size)]
        
        best_fitness_history = []
        best_individual = None
        best_fitness = float("-inf")
        
        room_lookup = {r["room_code"]: r for r in classrooms}

        for gen in range(self.generations):
            fitnesses = [self._calculate_fitness(ind, classrooms) for ind in population]
            
            # Track best in generation
            max_fit = max(fitnesses)
            best_idx = fitnesses.index(max_fit)
            if max_fit > best_fitness:
                best_fitness = max_fit
                best_individual = copy.deepcopy(population[best_idx])
                
            best_fitness_history.append(round(best_fitness, 2))
            
            # Elitism: retain top 2 individuals
            sorted_pop = [ind for _, ind in sorted(zip(fitnesses, population), key=lambda pair: pair[0], reverse=True)]
            new_population = [copy.deepcopy(sorted_pop[0]), copy.deepcopy(sorted_pop[1])]
            
            # Create next generation
            while len(new_population) < self.population_size:
                p1 = self._tournament_selection(population, fitnesses)
                p2 = self._tournament_selection(population, fitnesses)
                child = self._crossover(p1, p2)
                self._mutate(child, classrooms)
                new_population.append(child)
                
            population = new_population

        # Generate detailed result payload with reasoning
        results = []
        booked_room_slots = set()
        booked_lec_slots = set()
        booked_batch_slots = set()
        room_clashes = 0
        lecturer_clashes = 0
        batch_clashes = 0
        
        for gene in best_individual:
            course = gene["course"]
            room_code = gene["assigned_room"]
            room = room_lookup[room_code]
            day = gene.get("assigned_day", course.get("day", "Monday"))
            slot = gene.get("assigned_time_slot", course.get("time_slot", "08:30-10:30"))
            
            pred_att = course.get("predicted_attendance", course["enrolled_students"])
            lecturer = course.get("lecturer_id") or course.get("lecturer_name")
            batch = course.get("intake") or course.get("degree_program") or course.get("course_code")
            
            room_key = (room_code, day, slot)
            is_room_clash = room_key in booked_room_slots
            if is_room_clash:
                room_clashes += 1
            booked_room_slots.add(room_key)

            is_lec_clash = False
            if lecturer:
                lec_key = (lecturer, day, slot)
                is_lec_clash = lec_key in booked_lec_slots
                if is_lec_clash:
                    lecturer_clashes += 1
                booked_lec_slots.add(lec_key)

            is_batch_clash = False
            if batch:
                batch_key = (batch, day, slot)
                is_batch_clash = batch_key in booked_batch_slots
                if is_batch_clash:
                    batch_clashes += 1
                booked_batch_slots.add(batch_key)
            
            is_clash = is_room_clash or is_lec_clash or is_batch_clash
            utilization = round((pred_att / room["capacity"]) * 100, 1)
            is_cross = room.get("faculty") != course.get("faculty")
            
            # Generate Explainability rationale
            reasons = []
            reasons.append(f"Capacity match: {room['capacity']} seats for predicted {pred_att} students ({utilization}% utilization).")
            if room.get("is_lab"):
                reasons.append("Dedicated practical lab environment configured.")
            if is_cross:
                reasons.append(f"Cross-Faculty Sharing: Allocated from {room.get('faculty')} to optimize space.")
            else:
                reasons.append("Allocated within home faculty building (minimal travel distance).")
                
            results.append({
                "course_code": course.get("course_code", "N/A"),
                "course_name": course.get("course_name", "N/A"),
                "faculty": course.get("faculty", "N/A"),
                "department": course.get("department", "General"),
                "intake": course.get("intake", "General Intake"),
                "day": day,
                "time_slot": slot,
                "enrolled_students": course.get("enrolled_students"),
                "predicted_attendance": pred_att,
                "assigned_room": room_code,
                "room_name": room.get("room_name"),
                "room_capacity": room.get("capacity"),
                "utilization_percentage": utilization,
                "is_cross_faculty": is_cross,
                "has_clash": is_clash,
                "ai_reasons": reasons
            })

        total_clashes = room_clashes + lecturer_clashes + batch_clashes

        return {
            "total_courses": len(courses),
            "total_clashes": total_clashes,
            "room_clashes": room_clashes,
            "lecturer_clashes": lecturer_clashes,
            "batch_clashes": batch_clashes,
            "best_fitness_score": round(best_fitness, 2),
            "fitness_convergence": best_fitness_history[-10:],
            "allocations": results
        }

if __name__ == "__main__":
    from app.data.dataset_generator import generate_attendance_dataset
    print("Testing Genetic Algorithm Optimizer...")
    
    mock_classrooms = [
        {"room_code": "FOM 4-1", "room_name": "FOM Lecture Hall 4-1", "capacity": 120, "faculty": "Computing", "is_lab": False, "has_ac": True},
        {"room_code": "FGS 3-1", "room_name": "FGS Lecture Hall 3-1", "capacity": 82, "faculty": "Computing", "is_lab": False, "has_ac": True},
        {"room_code": "CCNA Lab", "room_name": "Networking CCNA Lab", "capacity": 40, "faculty": "Computing", "is_lab": True, "has_ac": True},
        {"room_code": "FOM 4-2", "room_name": "FOM Seminar Room 4-2", "capacity": 124, "faculty": "Computing", "is_lab": False, "has_ac": True},
    ]
    mock_courses = [
        {"course_code": "CS22023", "course_name": "Artificial Intelligence", "faculty": "Computing", "enrolled_students": 115, "predicted_attendance": 92, "day": "Monday", "time_slot": "08:30-10:30", "requires_lab": False},
        {"course_code": "CS22042", "course_name": "AI Practical Lab", "faculty": "Computing", "enrolled_students": 42, "predicted_attendance": 40, "day": "Monday", "time_slot": "08:30-10:30", "requires_lab": True},
        {"course_code": "IT3103", "course_name": "Service Oriented Web Prog", "faculty": "Computing", "enrolled_students": 89, "predicted_attendance": 68, "day": "Monday", "time_slot": "08:30-10:30", "requires_lab": False},
    ]
    ga = GeneticClassroomOptimizer(generations=20)
    res = ga.optimize(mock_courses, mock_classrooms)
    print("GA Optimization Result Clashes:", res["total_clashes"], "Fitness:", res["best_fitness_score"])
