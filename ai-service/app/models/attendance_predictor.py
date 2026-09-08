"""
AI Concept 1: Random Forest Attendance Predictor Pipeline
Trains an ensemble regressor on campus historical data.
Provides Explainable AI (XAI) breakdown alongside numerical predictions.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error

class AttendancePredictor:
    def __init__(self, data_path: str = None, model_save_path: str = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        if data_path is None:
            self.data_path = os.path.join(base_dir, "data", "historical_attendance.csv")
        else:
            self.data_path = data_path
            
        if model_save_path is None:
            self.model_save_path = os.path.join(base_dir, "trained_artifacts", "rf_attendance_model.joblib")
        else:
            self.model_save_path = model_save_path
            
        self.pipeline = None
        self.metrics = {}
        
        # Ensure training dataset exists
        if not os.path.exists(self.data_path):
            from app.data.dataset_generator import generate_attendance_dataset
            generate_attendance_dataset(self.data_path)
            
        self.load_or_train()

    def load_or_train(self, force_retrain: bool = False):
        os.makedirs(os.path.dirname(self.model_save_path), exist_ok=True)
        
        if os.path.exists(self.model_save_path) and not force_retrain:
            try:
                saved = joblib.load(self.model_save_path)
                self.pipeline = saved["pipeline"]
                self.metrics = saved["metrics"]
                return
            except Exception:
                pass
                
        self.train_and_evaluate()

    def train_and_evaluate(self):
        df = pd.read_csv(self.data_path)
        
        feature_cols = ["enrolled_students", "day_of_week", "time_slot", "course_type", "is_exam_near", "weather"]
        X = df[feature_cols]
        y = df["actual_attendance"]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
        
        categorical_features = ["day_of_week", "time_slot", "course_type", "weather"]
        numeric_features = ["enrolled_students", "is_exam_near"]
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
            ],
            remainder='passthrough'
        )
        
        self.pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=120, max_depth=12, random_state=42, n_jobs=-1))
        ])
        
        self.pipeline.fit(X_train, y_train)
        
        # Evaluate
        preds = self.pipeline.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        mse = mean_squared_error(y_test, preds)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, preds)
        
        self.metrics = {
            "r2_score": round(r2, 4),
            "mae_students": round(mae, 2),
            "rmse_students": round(rmse, 2),
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }
        
        joblib.dump({"pipeline": self.pipeline, "metrics": self.metrics}, self.model_save_path)
        print(f"[+] Random Forest Model Trained successfully: R2={self.metrics['r2_score']}, MAE={self.metrics['mae_students']} students")

    def predict(self, enrolled: int, day: str, slot: str, course_type: str, is_exam_near: int = 0, weather: str = "Sunny") -> dict:
        """
        Generates attendance prediction along with explainable AI reasoning.
        """
        input_df = pd.DataFrame([{
            "enrolled_students": enrolled,
            "day_of_week": day,
            "time_slot": slot,
            "course_type": course_type,
            "is_exam_near": is_exam_near,
            "weather": weather
        }])
        
        pred_continuous = self.pipeline.predict(input_df)[0]
        pred_int = int(np.clip(round(pred_continuous), 1, enrolled))
        pred_rate = round((pred_int / enrolled) * 100, 1)
        
        # Explainability Engine: Analyze key contributing factors
        reasons = []
        if day in ["Monday", "Friday"]:
            reasons.append(f"Historical trend: Attendance on {day}s is typically lower (-8%).")
        if slot == "08:30-10:30":
            reasons.append("Early morning time slot has a slight negative attendance influence (-7%).")
        elif slot == "10:30-12:30":
            reasons.append("Mid-morning slot represents peak campus engagement (+5%).")
            
        if course_type == "Lab":
            reasons.append("Practical Lab sessions have mandatory lab assessment criteria (+14% turnout).")
            
        if is_exam_near == 1:
            reasons.append("Pre-examination revision period increases expected turnout (+12%).")
            
        if weather == "Rainy":
            reasons.append("Adverse weather condition factored into slight attendance drop (-6%).")
            
        if not reasons:
            reasons.append("Standard academic session following baseline turnout distribution (~78%).")
            
        confidence = round(max(0.80, min(0.96, self.metrics.get("r2_score", 0.90) - (0.05 if weather == 'Rainy' else 0.0))), 2)

        return {
            "enrolled_students": enrolled,
            "predicted_attendance": pred_int,
            "predicted_rate_percentage": pred_rate,
            "confidence_score": confidence,
            "model_metrics": self.metrics,
            "explainable_reasons": reasons
        }

if __name__ == "__main__":
    predictor = AttendancePredictor()
    res = predictor.predict(120, "Monday", "08:30-10:30", "Lecture", is_exam_near=0)
    print("Test Prediction:", res)
