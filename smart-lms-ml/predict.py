import joblib
import pandas as pd
import numpy as np
from datetime import datetime

def load_models():
    """Load các models đã được train."""
    try:
        cluster_model = joblib.load('student_cluster_model.pkl')
        grade_model = joblib.load('grade_prediction_model.pkl')
        print("✅ Load models thành công!")
        return cluster_model, grade_model
    except Exception as e:
        print(f"❌ Lỗi load models: {e}")
        return None, None

def predict_student_performance(student_data):
    """Dự đoán hiệu suất học sinh."""
    cluster_model, grade_model = load_models()
    
    if cluster_model is None or grade_model is None:
        return None
    
    try:
        # ✅ Đúng columns theo database thực tế (không có DeviceType, SatisfactionLevel)
        required_columns = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                          'PlatformEngagement_Minutes', 'Motivation', 'StressLevel', 'LearningStyle']
        
        df_input = pd.DataFrame([student_data])
        
        # ✅ Xử lý numeric columns
        numeric_cols = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                       'PlatformEngagement_Minutes', 'Motivation', 'StressLevel']
        
        for col in numeric_cols:
            if col in df_input.columns:
                df_input[col] = pd.to_numeric(df_input[col], errors='coerce')
        
        # ✅ Xử lý LearningStyle - đảm bảo là integer
        if 'LearningStyle' in df_input.columns:
            df_input['LearningStyle'] = pd.to_numeric(df_input['LearningStyle'], errors='coerce')
            df_input['LearningStyle'] = df_input['LearningStyle'].fillna(0).astype(int)
        else:
            df_input['LearningStyle'] = 0  # Default value
        
        # Fill missing numeric values
        df_input[numeric_cols] = df_input[numeric_cols].fillna(0)
        
        # Ensure correct column order (numeric first, then categorical)
        ordered_columns = numeric_cols + ['LearningStyle']
        df_input = df_input.reindex(columns=ordered_columns, fill_value=0)
        
        print(f"📊 Final input shape: {df_input.shape}")
        print(f"📊 Final dtypes: {df_input.dtypes.to_dict()}")
        print(f"📊 Sample values: {df_input.iloc[0].to_dict()}")
        
        # Predictions
        cluster_prediction = cluster_model.predict(df_input)
        grade_prediction = grade_model.predict(df_input)
        grade_probability = grade_model.predict_proba(df_input)
        
        result = {
            "cluster": cluster_prediction.tolist(),
            "predicted_grade": grade_prediction.tolist(),
            "grade_probabilities": grade_probability.tolist(),
            "grade_classes": grade_model.classes_.tolist()
        }
        
        return result
        
    except Exception as e:
        print(f"❌ Lỗi khi predict: {e}")
        import traceback
        traceback.print_exc()
        return None

def format_for_dashboard(prediction_result):
    """✅ Format cuối cùng cho AIPredictionCard component - Updated cho logic mới."""
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
        
        # ✅ Recommendations cải tiến theo logic mới
        recommendations = get_detailed_recommendations(grade, cluster)
        
        return {
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
                "recommendations": recommendations,
                "metadata": {
                    "model_version": "1.3",
                    "timestamp": datetime.now().isoformat(),
                    "grading_scale": "4.0 Point Scale (Updated)",
                    "data_source": "Kaggle Student Performance Dataset"
                }
            }
        }
        
    except Exception as e:
        print(f"❌ Dashboard format error: {e}")
        return {"success": False, "error": str(e)}

def get_grade_interpretation(grade):
    """✅ Giải thích ý nghĩa của grade theo logic mới."""
    interpretations = {
        "Xuất sắc": "Xuất sắc (3.5-4.0) - Thành tích học tập vượt trội, đạt chuẩn cao nhất",
        "Giỏi": "Giỏi (2.5-3.4) - Hiệu suất học tập tốt, vượt qua mức mong đợi", 
        "Khá": "Khá (1.5-2.4) - Đạt mức độ mong đợi, có thể cải thiện thêm",
        "Trung bình": "Trung bình (≤1.4) - Ở mức cơ bản, cần nỗ lực để cải thiện"
    }
    return interpretations.get(grade, "Không xác định")

def get_detailed_recommendations(grade, cluster):
    """✅ Đưa ra khuyến nghị chi tiết theo logic phân loại mới."""
    base_recommendations = {
        "Xuất sắc": {
            "study_approach": "Duy trì đẳng cấp xuất sắc, thử thách bản thân với nghiên cứu chuyên sâu",
            "focus_areas": ["Nghiên cứu độc lập", "Leadership", "Mentoring", "Innovation"],
            "next_steps": "Tham gia nghiên cứu khoa học, làm mentor, thi Olympic",
            "motivation_tips": "Đặt mục tiêu cao hơn, tạo impact tích cực cho cộng đồng"
        },
        "Giỏi": {
            "study_approach": "Tiếp tục phát huy thế mạnh, hướng tới mức xuất sắc",
            "focus_areas": ["Kỹ năng chuyên sâu", "Tư duy phản biện", "Dự án nâng cao"],
            "next_steps": "Tham gia competition, nghiên cứu nhóm, làm project leader",
            "motivation_tips": "Thử thách bản thân với mức độ khó hơn"
        },
        "Khá": {
            "study_approach": "Cải thiện phương pháp học tập để đạt mức giỏi",
            "focus_areas": ["Quản lý thời gian", "Kỹ năng học tập", "Tương tác tích cực"],
            "next_steps": "Lập kế hoạch học tập chi tiết, tham gia nhóm học, tìm mentor",
            "motivation_tips": "Đặt mục tiêu cụ thể và khen thưởng bản thân khi đạt được"
        },
        "Trung bình": {
            "study_approach": "Tăng cường học tập cơ bản, xây dựng nền tảng vững chắc",
            "focus_areas": ["Kỹ năng cơ bản", "Động lực học tập", "Hỗ trợ từ giáo viên"],
            "next_steps": "Tham gia lớp bổ trợ, tìm study buddy, gặp tư vấn học tập",
            "motivation_tips": "Tập trung vào tiến bộ từng bước, không so sánh với người khác"
        }
    }
    
    return base_recommendations.get(grade, base_recommendations["Trung bình"])

def get_study_recommendation(grade, cluster):
    """Khuyến nghị học tập theo grade và cluster."""
    recommendations = {
        ("Xuất sắc", 0): "Mặc dù xuất sắc về điểm số, cần cải thiện engagement và participation",
        ("Xuất sắc", 1): "Duy trì đẳng cấp xuất sắc và tăng cường leadership skills",
        ("Xuất sắc", 2): "Perfect combination! Tiếp tục phát huy và mentoring cho others",
        ("Xuất sắc", 3): "Outstanding performer! Focus on innovation và research projects",
        
        ("Giỏi", 0): "Điểm tốt nhưng cần tăng engagement với học tập và activities",
        ("Giỏi", 1): "Good balance - tiếp tục phát triển đều và stable improvement",
        ("Giỏi", 2): "Excellent trajectory - hướng tới mức xuất sắc trong thời gian tới",
        ("Giỏi", 3): "High achiever - maintain excellence và explore advanced topics",
        
        ("Khá", 0): "Cần cải thiện cả academic performance và engagement simultaneously", 
        ("Khá", 1): "Stable learner - focus on consistent improvement strategies",
        ("Khá", 2): "Good potential - push towards higher performance levels",
        ("Khá", 3): "Strong in engagement - align academic performance to match",
        
        ("Trung bình", 0): "Cần intervention - both academic support và motivation boost",
        ("Trung bình", 1): "Basic performance - focus on building strong fundamentals",
        ("Trung bình", 2): "Có potential - cần guidance để unlock full capabilities", 
        ("Trung bình", 3): "High engagement low performance - check learning methods"
    }
    
    return recommendations.get((grade, cluster), "Tiếp tục cố gắng và tìm phương pháp phù hợp")

def get_focus_areas(cluster):
    """Lĩnh vực cần tập trung theo cluster."""
    areas = {
        0: ["Tăng cường participation", "Cải thiện study habits", "Boost motivation"],
        1: ["Consistency in learning", "Time management", "Regular review"],
        2: ["Advanced skills", "Leadership development", "Peer collaboration"],
        3: ["Innovation thinking", "Research skills", "Mentoring others"]
    }
    return areas.get(cluster, ["Phát triển toàn diện"])

def get_improvement_tips(grade):
    """Mẹo cải thiện theo grade mới."""
    tips = {
        "Xuất sắc": ["Maintain excellence", "Explore cutting-edge topics", "Share knowledge", "Lead by example"],
        "Giỏi": ["Push for excellence", "Take on challenges", "Develop specialization", "Build portfolio"],
        "Khá": ["Strengthen weak areas", "Practice consistently", "Seek feedback", "Join study groups"],
        "Trung bình": ["Focus on basics", "Create study schedule", "Get extra help", "Celebrate small wins"]
    }
    return tips.get(grade, ["Tiếp tục học tập"])

# Test với data thực tế từ database
if __name__ == "__main__":
    # ✅ Test data theo đúng format database  
    test_data = {
        'StudyHours': 19,
        'AssignmentCompletionRate': 90,
        'QuizScore_Avg': 66,
        'PlatformEngagement_Minutes': 3840,
        'Motivation': 3,
        'StressLevel': 1,
        'LearningStyle': 2  # Integer từ 0-3
    }
    
    print("🚀 Testing prediction với logic phân loại mới...")
    result = predict_student_performance(test_data)
    
    if result:
        print("✅ Prediction successful!")
        print(f"   Cluster: {result['cluster']}")
        print(f"   Grade: {result['predicted_grade']}")
        print(f"   Available classes: {result['grade_classes']}")
        print(f"   Probabilities: {result['grade_probabilities']}")
        
        dashboard_data = format_for_dashboard(result)
        print("\n📊 Dashboard format:")
        print(f"   Success: {dashboard_data['success']}")
        if dashboard_data['success']:
            data = dashboard_data['data']
            print(f"   Performance: {data['prediction_summary']['performance_level']}")
            print(f"   Cluster: {data['prediction_summary']['cluster_name']}")
            print(f"   Confidence: {data['prediction_summary']['confidence']:.1f}%")
            print(f"   Interpretation: {data['detailed_analysis']['grade_interpretation']}")
            print(f"   Recommendations: {data['recommendations']['study_approach']}")
        else:
            print(f"   Error: {dashboard_data.get('error', 'Unknown error')}")
    else:
        print("❌ Prediction failed!")
