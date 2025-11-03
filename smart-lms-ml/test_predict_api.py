#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import os
from pathlib import Path

print("🚀 Starting prediction API test...")
print(f"📂 Current directory: {os.getcwd()}")
print(f"📄 Python version: {sys.version}")

# Check if model files exist
model_files = ["student_cluster_model.pkl", "grade_prediction_model.pkl"]
for model_file in model_files:
    if os.path.exists(model_file):
        print(f"✅ Found model: {model_file}")
    else:
        print(f"❌ Missing model: {model_file}")

try:
    import joblib
    import pandas as pd
    import numpy as np
    from datetime import datetime
    print("✅ All required packages imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

def load_models():
    """Load các models đã được train."""
    try:
        print("📥 Loading models...")
        cluster_model = joblib.load('student_cluster_model.pkl')
        grade_model = joblib.load('grade_prediction_model.pkl')
        print("✅ Models loaded successfully!")
        print(f"📊 Grade model classes: {grade_model.classes_}")
        return cluster_model, grade_model, True
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        return None, None, False

def predict_student_performance(student_data):
    """Dự đoán hiệu suất học sinh."""
    print(f"📊 Input data: {student_data}")
    
    cluster_model, grade_model, models_loaded = load_models()
    
    if not models_loaded:
        return {
            "success": False,
            "error": "Failed to load ML models"
        }
    
    try:
        required_columns = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                          'PlatformEngagement_Minutes', 'Motivation', 'StressLevel', 'LearningStyle']
        
        print(f"📋 Required columns: {required_columns}")
        
        df_input = pd.DataFrame([student_data])
        print(f"📊 DataFrame created: {df_input.shape}")
        print(f"📊 DataFrame columns: {df_input.columns.tolist()}")
        
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
        
        print(f"📊 Processed DataFrame shape: {df_input.shape}")
        print(f"📊 Processed DataFrame dtypes: {df_input.dtypes.to_dict()}")
        print(f"📊 Processed data sample: {df_input.iloc[0].to_dict()}")
        
        # Make predictions
        print("🔮 Making cluster prediction...")
        cluster_prediction = cluster_model.predict(df_input)
        print(f"✅ Cluster prediction: {cluster_prediction}")
        
        print("🔮 Making grade prediction...")
        grade_prediction = grade_model.predict(df_input)
        print(f"✅ Grade prediction: {grade_prediction}")
        
        print("🔮 Getting prediction probabilities...")
        grade_probability = grade_model.predict_proba(df_input)
        print(f"✅ Grade probabilities: {grade_probability}")
        
        result = {
            "cluster": cluster_prediction.tolist(),
            "predicted_grade": grade_prediction.tolist(),
            "grade_probabilities": grade_probability.tolist(),
            "grade_classes": grade_model.classes_.tolist()
        }
        
        print("🎯 Raw prediction result:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # Format for dashboard
        formatted_result = format_for_dashboard(result)
        return formatted_result
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }

def format_for_dashboard(prediction_result):
    """Format output cho AIPredictionCard component."""
    print("🎨 Formatting result for dashboard...")
    
    if not prediction_result:
        return {"success": False, "error": "Prediction failed"}
        
    try:
        cluster = prediction_result["cluster"][0]
        grade = prediction_result["predicted_grade"][0]
        probabilities = prediction_result["grade_probabilities"][0]
        classes = prediction_result["grade_classes"]
        
        print(f"📊 Cluster: {cluster}, Grade: {grade}")
        print(f"📊 Classes: {classes}")
        print(f"📊 Probabilities: {probabilities}")
        
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
        
        formatted_result = {
            "success": True,
            "data": {
                "prediction_summary": {
                    "performance_level": grade,
                    "cluster_group": cluster,
                    "cluster_name": cluster_names.get(cluster, f"Nhóm {cluster}"),
                    "confidence": max(probabilities) * 100
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
                    "grading_scale": "4.0 Point Scale (Updated)",
                    "data_source": "Kaggle Student Performance Dataset"
                }
            }
        }
        
        print("✅ Dashboard formatting completed!")
        return formatted_result
        
    except Exception as e:
        print(f"❌ Formatting error: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}

def get_grade_interpretation(grade):
    interpretations = {
        "Xuất sắc": "Xuất sắc (3.5-4.0) - Thành tích học tập vượt trội",
        "Giỏi": "Giỏi (2.5-3.4) - Hiệu suất học tập tốt", 
        "Khá": "Khá (1.5-2.4) - Đạt mức độ mong đợi",
        "Trung bình": "Trung bình (≤1.4) - Cần nỗ lực cải thiện"
    }
    return interpretations.get(grade, "Không xác định")

def get_detailed_recommendations(grade, cluster):
    recommendations = {
        "study_approach": f"Phương pháp học tập phù hợp với mức {grade}",
        "focus_areas": ["Cải thiện kỹ năng cơ bản", "Tăng động lực học tập"],
        "next_steps": "Tiếp tục phát triển theo hướng tích cực",
        "motivation_tips": "Duy trì động lực và tính kiên trì"
    }
    return recommendations

def main():
    print("=" * 50)
    print("🎯 STUDENT PERFORMANCE PREDICTION TEST")
    print("=" * 50)
    
    # Test data
    test_data = {
        "StudyHours": 19,
        "AssignmentCompletionRate": 90,
        "QuizScore_Avg": 66,
        "PlatformEngagement_Minutes": 3840,
        "Motivation": 3,
        "StressLevel": 1,
        "LearningStyle": 2
    }
    
    print("🧪 Testing with sample data...")
    
    # Make prediction
    result = predict_student_performance(test_data)
    
    # Output result
    print("\n" + "=" * 50)
    print("🎯 FINAL RESULT:")
    print("=" * 50)
    
    print("RESULT_START")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print("RESULT_END")
    
    if result.get("success"):
        print("\n✅ Prediction completed successfully!")
        summary = result["data"]["prediction_summary"]
        print(f"📊 Performance Level: {summary['performance_level']}")
        print(f"🏆 Cluster: {summary['cluster_name']}")
        print(f"🎯 Confidence: {summary['confidence']:.1f}%")
    else:
        print(f"\n❌ Prediction failed: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
