"""
AI Concept 3: Multi-Attribute Utility Study Space Recommendation Engine
Ranks available campus study areas for students during free hours based on:
1. Proximity to current faculty/building
2. Quiet level preferences (Silent Study, Moderate, Group Discussion)
3. Amenities (Wi-Fi, Charging Ports, AC)
4. Available space headroom
"""

from typing import List, Dict, Any

class StudySpaceRecommender:
    def __init__(self):
        pass

    def recommend(self, 
                  student_faculty: str, 
                  available_spaces: List[Dict[str, Any]], 
                  need_quiet: bool = True, 
                  require_charging: bool = True) -> List[Dict[str, Any]]:
        """
        Ranks available spaces with multi-attribute scoring and explainability.
        """
        scored_spaces = []
        
        for space in available_spaces:
            score = 0.0
            reasons = []
            
            # 1. Proximity Scoring (Weight: 35%)
            is_same_faculty = space.get("faculty") == student_faculty
            is_general_lib = space.get("faculty") == "General" or "Library" in space.get("building", "")
            
            if is_same_faculty:
                score += 35.0
                reasons.append("Located within your current faculty building (minimal walk).")
            elif is_general_lib:
                score += 28.0
                reasons.append("Central campus location (Central Library Commons).")
            else:
                score += 15.0
                reasons.append(f"Located in adjacent faculty ({space.get('faculty')}).")
                
            # 2. Quiet Level & Ambience Match (Weight: 25%)
            quiet_level = space.get("quiet_level", "MODERATE")
            if need_quiet:
                if quiet_level == "SILENT" or space.get("type") == "STUDY_SPACE":
                    score += 25.0
                    reasons.append("Dedicated silent learning environment with minimal disruption.")
                elif quiet_level == "MODERATE":
                    score += 18.0
                    reasons.append("Moderate ambient noise suitable for standard self-study.")
                else:
                    score += 8.0
            else:
                if quiet_level == "GROUP_DISCUSSION":
                    score += 25.0
                    reasons.append("Optimized for group project discussions and collaboration.")
                else:
                    score += 15.0
                    
            # 3. Amenities Match (Weight: 20%)
            amenity_score = 0.0
            if space.get("has_ac", True):
                amenity_score += 8.0
            if space.get("has_wifi", True):
                amenity_score += 6.0
            if require_charging and space.get("has_charging_ports", True):
                amenity_score += 6.0
                reasons.append("Equipped with laptop charging stations & high-speed Wi-Fi.")
            score += amenity_score
            
            # 4. Capacity & Space Availability (Weight: 20%)
            capacity = space.get("capacity", 30)
            if capacity >= 25:
                score += 20.0
                reasons.append("High seating capacity ensures available desk space.")
            else:
                score += 14.0
                
            # 5. KNN Feature Vector Distance Metric (Euclidean Similarity)
            # Query vector Q vs Space vector S: [proximity(0-1), quiet(0-1), ac(0-1), charging(0-1), capacity(0-1)]
            q_vec = [1.0, 1.0 if need_quiet else 0.5, 1.0, 1.0 if require_charging else 0.0, 0.8]
            s_vec = [
                1.0 if is_same_faculty else (0.8 if is_general_lib else 0.4),
                1.0 if (need_quiet and quiet_level in ["SILENT", "MODERATE"]) or (not need_quiet and quiet_level == "GROUP_DISCUSSION") else 0.3,
                1.0 if space.get("has_ac", True) else 0.0,
                1.0 if space.get("has_charging_ports", True) else 0.0,
                min(1.0, capacity / 50.0)
            ]
            euclidean_dist = sum((q - s) ** 2 for q, s in zip(q_vec, s_vec)) ** 0.5
            knn_similarity = round(max(0.0, 100.0 - (euclidean_dist * 22.0)), 1)
            
            final_score = round(min(100.0, (score * 0.7) + (knn_similarity * 0.3)), 1)
            
            scored_spaces.append({
                "room_code": space.get("room_code"),
                "room_name": space.get("room_name"),
                "building": space.get("building"),
                "faculty": space.get("faculty"),
                "quiet_level": quiet_level,
                "capacity": capacity,
                "has_ac": space.get("has_ac", True),
                "has_charging_ports": space.get("has_charging_ports", True),
                "match_score": final_score,
                "knn_similarity_score": knn_similarity,
                "euclidean_distance": round(euclidean_dist, 3),
                "ai_reasons": reasons
            })
            
        # Rank by match score descending
        ranked_spaces = sorted(scored_spaces, key=lambda s: s["match_score"], reverse=True)
        return ranked_spaces

if __name__ == "__main__":
    recommender = StudySpaceRecommender()
    test_spaces = [
        {"room_code": "LIB-S101", "room_name": "Library Silent Study", "faculty": "General", "building": "Central Library", "quiet_level": "SILENT", "capacity": 30, "has_ac": True, "has_charging_ports": True},
        {"room_code": "FOC-L103", "room_name": "Computing Seminar", "faculty": "Computing", "building": "Computing Block A", "quiet_level": "MODERATE", "capacity": 40, "has_ac": True, "has_charging_ports": True},
    ]
    recs = recommender.recommend("Computing", test_spaces, need_quiet=True)
    print("Ranked recommendations:", recs[0]["room_code"], "Score:", recs[0]["match_score"])
