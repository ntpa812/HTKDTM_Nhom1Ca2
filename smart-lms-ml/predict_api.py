#!/usr/bin/env python3
import sys
import json
import argparse
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

def load_models():
    """Load các models đã được train."""
    try:
        cluster_model = joblib.load('student_cluster_model.pkl')
        grade_model = joblib.load('grade_prediction_model.pkl')
        return cluster_model, grade_model, True
    except Exception as e:
        return None, None, False

def predict_student_performance(student_data):
    """Dự đoán hiệu suất học sinh."""
    cluster_model, grade_model, models_loaded = load_models()
    
    if not models_loaded:
        return {
            "success": False,
            "error": "Failed to load ML models"
        }
    
    try:
        required_columns = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                          'PlatformEngagement_Minutes', 'Motivation', 'StressLevel', 'LearningStyle']
        
        df_input = pd.DataFrame([student_data])
        
        # Process numeric columns
        numeric_cols = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                       'PlatformEngagement_Minutes', 'Motivation', 'StressLevel']
        
        for col in numeric_cols:
            if col in df_input.columns:
                df_input[col] = pd.to_numeric(df_input[col], errors='coerce')
        
        # Process LearningStyle
        if 'LearningStyle' in df_input.columns:
            df_input['LearningStyle'] = pd.to_numeric(df_input['LearningStyle'], errors='coerce')
            df_input['LearningStyle'] = df_input['LearningStyle'].fillna(0).astype(int)
        else:
            df_input['LearningStyle'] = 0
        
        # Fill missing values
        df_input[numeric_cols] = df_input[numeric_cols].fillna(0)
        
        # Ensure correct column order
        ordered_columns = numeric_cols + ['LearningStyle']
        df_input = df_input.reindex(columns=ordered_columns, fill_value=0)
        
        # Make predictions
        cluster_prediction = cluster_model.predict(df_input)
        grade_prediction = grade_model.predict(df_input)
        grade_probability = grade_model.predict_proba(df_input)
        
        result = {
            "cluster": cluster_prediction.tolist(),
            "predicted_grade": grade_prediction.tolist(),
            "grade_probabilities": grade_probability.tolist(),
            "grade_classes": grade_model.classes_.tolist()
        }
        
        # Format for dashboard
        formatted_result = format_for_dashboard(result)
        return formatted_result
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }

def format_for_dashboard(prediction_result):
    """Format output cho AIPredictionCard component."""
    if not prediction_result:
        return {"success": False, "error": "Prediction failed"}
        
    try:
        cluster = prediction_result["cluster"][0]
        grade = prediction_result["predicted_grade"][0]
        probabilities = prediction_result["grade_probabilities"][0]
        classes = prediction_result["grade_classes"]
        
        # Create confidence scores
        confidence_scores = {}
        for i, class_name in enumerate(classes):
            confidence_scores[class_name] = round(probabilities[i] * 100, 2)
        
        cluster_names = {
            0: "Nhóm cần hỗ trợ cơ bản",
            1: "Nhóm học tập ổn định", 
            2: "Nhóm tiến bộ tốt",
            3: "Nhóm xuất sắc"
        }
        
        return {
            "success": True,
            "data": {
                "prediction_summary": {
                    "performance_level": grade,
                    "cluster_group": cluster,
                    "cluster_name": cluster_names.get(cluster, f"Nhóm {cluster}"),
                    "confidence": round(max(probabilities) * 100, 1)
                },
                "detailed_analysis": {
                    "grade_probabilities": confidence_scores,
                    "most_likely_outcome": {
                        "grade": max(confidence_scores.items(), key=lambda x: x[1])[0],
                        "confidence": max(confidence_scores.values())
                    },
                    "grade_interpretation": get_grade_interpretation(grade)
                },
                "recommendations": get_detailed_recommendations(grade, cluster),
                "metadata": {
                    "model_version": "1.3",
                    "timestamp": datetime.now().isoformat(),
                    "grading_scale": "4.0 Point Scale",
                    "data_source": "Smart-LMS AI Analytics"
                }
            }
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_grade_interpretation(grade):
    interpretations = {
        "Xuất sắc": "Xuất sắc (3.5-4.0) - Thành tích vượt trội",
        "Giỏi": "Giỏi (2.5-3.4) - Hiệu suất tốt", 
        "Khá": "Khá (1.5-2.4) - Đạt mức độ mong đợi",
        "Trung bình": "Trung bình (≤1.4) - Cần cải thiện"
    }
    return interpretations.get(grade, "Không xác định")

def get_detailed_recommendations(grade, cluster):
    return {
        "study_approach": f"Phương pháp học tập phù hợp với mức {grade}",
        "focus_areas": ["Cải thiện kỹ năng", "Tăng động lực"],
        "next_steps": "Tiếp tục phát triển",
        "cluster_insight": f"Thuộc cluster {cluster} - điều chỉnh phương pháp phù hợp"
    }

def main():
    """✅ FIXED: Multiple input methods với fallback"""
    parser = argparse.ArgumentParser(description='Student Performance Prediction API')
    parser.add_argument('--input', type=str, help='JSON input data')
    parser.add_argument('--test', action='store_true', help='Run with test data')
    parser.add_argument('--file', type=str, help='Input from JSON file')
    
    try:
        args = parser.parse_args()
        
        # ✅ FIX 1: Multiple input methods
        if args.test:
            # Test mode với data có sẵn
            student_data = {
                "StudyHours": 19,
                "AssignmentCompletionRate": 90,
                "QuizScore_Avg": 66,
                "PlatformEngagement_Minutes": 3840,
                "Motivation": 3,
                "StressLevel": 1,
                "LearningStyle": 2
            }
            print("🧪 Running in TEST mode...", file=sys.stderr)
            
        elif args.file:
            # Read from file
            with open(args.file, 'r') as f:
                student_data = json.load(f)
            print(f"📁 Reading from file: {args.file}", file=sys.stderr)
            
        elif args.input:
            # ✅ FIX 2: Better JSON parsing với error handling
            try:
                student_data = json.loads(args.input)
                print("📊 Parsed command line input", file=sys.stderr)
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing error: {e}", file=sys.stderr)
                print("💡 Try using --test flag for testing", file=sys.stderr)
                sys.exit(1)
                
        else:
            # ✅ FIX 3: Default fallback thay vì chờ stdin
            print("⚠️  No input provided, running with default test data", file=sys.stderr)
            student_data = {
                "StudyHours": 19,
                "AssignmentCompletionRate": 90,
                "QuizScore_Avg": 66,
                "PlatformEngagement_Minutes": 3840,
                "Motivation": 3,
                "StressLevel": 1,
                "LearningStyle": 2
            }
        
        # Make prediction
        result = predict_student_performance(student_data)
        
        # ✅ FIX 4: Clean JSON output
        print(json.dumps(result, ensure_ascii=False, separators=(',', ':')))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Script execution failed: {str(e)}"
        }
        print(json.dumps(error_result, ensure_ascii=False))

if __name__ == "__main__":
    main()
