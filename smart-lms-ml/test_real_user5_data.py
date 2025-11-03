#!/usr/bin/env python3
import sys
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

def load_models():
    """Load models đã được train."""
    try:
        cluster_model = joblib.load('student_cluster_model.pkl')
        grade_model = joblib.load('grade_prediction_model.pkl')
        return cluster_model, grade_model, True
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        return None, None, False

def test_real_user5_scenarios():
    """Test với dữ liệu thực tế từ database của User ID = 5."""
    
    print("🎯 TESTING AI MODEL WITH REAL DATABASE DATA")
    print("👤 Student ID: 5")
    print("=" * 70)
    
    # ✅ Real data từ database StudentBehaviors cho UserID = 5
    real_scenarios = [
        {
            "name": "📈 High Performance Scenario",
            "behavior_id": 19,
            "data": {
                "StudyHours": 24,
                "AssignmentCompletionRate": 85,
                "QuizScore_Avg": 46,
                "PlatformEngagement_Minutes": 5880,
                "LearningStyle": 0,
                "Motivation": 2,
                "StressLevel": 1
            },
            "actual_final_grade": 3,
            "expected_ai_grade": "Giỏi"
        },
        {
            "name": "📉 Low Performance Scenario",
            "behavior_id": 109,
            "data": {
                "StudyHours": 17,
                "AssignmentCompletionRate": 64,
                "QuizScore_Avg": 87,
                "PlatformEngagement_Minutes": 5820,
                "LearningStyle": 1,
                "Motivation": 1,
                "StressLevel": 1
            },
            "actual_final_grade": 0,
            "expected_ai_grade": "Trung bình"
        },
        {
            "name": "📊 Medium Performance Scenario",
            "behavior_id": 137,
            "data": {
                "StudyHours": 17,
                "AssignmentCompletionRate": 88,
                "QuizScore_Avg": 49,
                "PlatformEngagement_Minutes": 4080,
                "LearningStyle": 3,
                "Motivation": 2,
                "StressLevel": 1
            },
            "actual_final_grade": 3,
            "expected_ai_grade": "Giỏi"
        },
        {
            "name": "🎯 Balanced Performance Scenario",
            "behavior_id": 94,
            "data": {
                "StudyHours": 17,
                "AssignmentCompletionRate": 70,
                "QuizScore_Avg": 82,
                "PlatformEngagement_Minutes": 5820,
                "LearningStyle": 2,
                "Motivation": 1,
                "StressLevel": 1
            },
            "actual_final_grade": 1,
            "expected_ai_grade": "Khá"
        },
        {
            "name": "🌟 Stress Test Scenario",
            "behavior_id": 163,
            "data": {
                "StudyHours": 16,
                "AssignmentCompletionRate": 56,
                "QuizScore_Avg": 75,
                "PlatformEngagement_Minutes": 4800,
                "LearningStyle": 1,
                "Motivation": 2,
                "StressLevel": 2
            },
            "actual_final_grade": 1,
            "expected_ai_grade": "Khá"
        }
    ]
    
    # Load models
    cluster_model, grade_model, models_loaded = load_models()
    
    if not models_loaded:
        print("❌ Cannot load models. Make sure pkl files exist.")
        return
    
    print(f"✅ Models loaded successfully!")
    print(f"📋 Available grade classes: {grade_model.classes_}")
    print()
    
    results_summary = []
    
    for i, scenario in enumerate(real_scenarios, 1):
        print(f"\n{'='*70}")
        print(f"🧪 TEST {i}/5: {scenario['name']}")
        print(f"📝 BehaviorID: {scenario['behavior_id']} | Actual FinalGrade: {scenario['actual_final_grade']}")
        print(f"🎯 Expected AI Grade: {scenario['expected_ai_grade']}")
        print(f"{'='*70}")
        
        # Display input data
        print(f"\n📊 INPUT DATA:")
        print("-" * 40)
        for key, value in scenario['data'].items():
            print(f"  {key:<28}: {value}")
        
        try:
            # Prepare and process data
            df_input = pd.DataFrame([scenario['data']])
            
            numeric_cols = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                           'PlatformEngagement_Minutes', 'Motivation', 'StressLevel']
            
            for col in numeric_cols:
                df_input[col] = pd.to_numeric(df_input[col], errors='coerce')
            
            df_input['LearningStyle'] = pd.to_numeric(df_input['LearningStyle'], errors='coerce')
            df_input['LearningStyle'] = df_input['LearningStyle'].fillna(0).astype(int)
            
            df_input[numeric_cols] = df_input[numeric_cols].fillna(0)
            
            ordered_columns = numeric_cols + ['LearningStyle']
            df_input = df_input.reindex(columns=ordered_columns, fill_value=0)
            
            # Make predictions
            cluster_prediction = cluster_model.predict(df_input)
            grade_prediction = grade_model.predict(df_input)
            grade_probability = grade_model.predict_proba(df_input)
            
            cluster = cluster_prediction[0]
            predicted_grade = grade_prediction[0]
            probabilities = grade_probability[0]
            classes = grade_model.classes_
            
            # Calculate confidence scores
            confidence_scores = {}
            for j, class_name in enumerate(classes):
                confidence_scores[class_name] = round(probabilities[j] * 100, 2)
            
            max_confidence = max(probabilities) * 100
            
            # Cluster names
            cluster_names = {
                0: "Nhóm cần hỗ trợ",
                1: "Nhóm ổn định", 
                2: "Nhóm tiến bộ",
                3: "Nhóm xuất sắc"
            }
            
            print(f"\n🔮 AI PREDICTION RESULTS:")
            print("-" * 40)
            print(f"  🏆 Predicted Grade: {predicted_grade}")
            print(f"  📈 Cluster: {cluster} ({cluster_names.get(cluster, 'Unknown')})")
            print(f"  🎯 Confidence: {max_confidence:.1f}%")
            
            print(f"\n📊 CONFIDENCE BREAKDOWN:")
            print("-" * 30)
            for grade_class, confidence in confidence_scores.items():
                print(f"  {grade_class:<15}: {confidence:>6.1f}%")
            
            # Compare with actual data
            actual_grade_mapping = {0: "Trung bình", 1: "Khá", 2: "Khá", 3: "Giỏi"}
            actual_mapped_grade = actual_grade_mapping.get(scenario['actual_final_grade'], "Unknown")
            
            prediction_correct = (predicted_grade == actual_mapped_grade)
            
            print(f"\n✅ ACCURACY CHECK:")
            print("-" * 25)
            print(f"  📊 Actual Grade (DB): {scenario['actual_final_grade']} → {actual_mapped_grade}")
            print(f"  🤖 AI Predicted: {predicted_grade}")
            print(f"  🎯 Match: {'✅ CORRECT' if prediction_correct else '❌ INCORRECT'}")
            
            # Store results
            results_summary.append({
                "scenario": scenario['name'],
                "behavior_id": scenario['behavior_id'],
                "actual_grade": scenario['actual_final_grade'],
                "actual_mapped": actual_mapped_grade,
                "predicted_grade": predicted_grade,
                "confidence": max_confidence,
                "cluster": cluster,
                "correct": prediction_correct
            })
            
            # Generate insights
            print(f"\n💡 INSIGHTS & RECOMMENDATIONS:")
            print("-" * 35)
            
            if predicted_grade == "Giỏi":
                print(f"  🌟 Strong performer! Focus on maintaining excellence")
                if scenario['data']['QuizScore_Avg'] < 60:
                    print(f"  ⚠️  Quiz scores could be improved ({scenario['data']['QuizScore_Avg']}%)")
                if scenario['data']['PlatformEngagement_Minutes'] > 5000:
                    print(f"  🚀 Excellent engagement ({scenario['data']['PlatformEngagement_Minutes']} min)")
                    
            elif predicted_grade == "Khá":
                print(f"  📈 Good performance with room for improvement")
                print(f"  💪 Recommendations:")
                print(f"     • Increase study hours if below 20h/week")
                print(f"     • Focus on quiz performance improvement")
                print(f"     • Maintain consistent engagement")
                
            elif predicted_grade == "Trung bình":
                print(f"  🆘 Needs support and intervention")
                print(f"  📋 Action items:")
                print(f"     • Schedule tutoring sessions")
                print(f"     • Improve study strategies")
                print(f"     • Increase platform engagement")
                
        except Exception as e:
            print(f"❌ Error in scenario {i}: {e}")
            import traceback
            traceback.print_exc()
    
    # Summary report
    print(f"\n" + "="*70)
    print(f"📋 COMPREHENSIVE TEST SUMMARY")
    print(f"="*70)
    
    correct_predictions = sum(1 for r in results_summary if r['correct'])
    total_tests = len(results_summary)
    accuracy = (correct_predictions / total_tests) * 100
    
    print(f"\n🎯 OVERALL ACCURACY: {correct_predictions}/{total_tests} ({accuracy:.1f}%)")
    print(f"\n📊 DETAILED RESULTS:")
    print("-" * 50)
    
    for r in results_summary:
        status = "✅" if r['correct'] else "❌"
        print(f"  {status} {r['scenario'][:20]:<20} | "
              f"Actual: {r['actual_mapped']:<12} | "
              f"Predicted: {r['predicted_grade']:<12} | "
              f"Conf: {r['confidence']:>5.1f}%")
    
    print(f"\n🔍 MODEL PERFORMANCE ANALYSIS:")
    print("-" * 40)
    
    if accuracy >= 80:
        print(f"  🌟 EXCELLENT: Model performs very well on real data!")
    elif accuracy >= 60:
        print(f"  👍 GOOD: Model has decent accuracy, some fine-tuning needed")
    else:
        print(f"  ⚠️  NEEDS IMPROVEMENT: Consider retraining with more data")
    
    # Grade distribution analysis
    predicted_grades = [r['predicted_grade'] for r in results_summary]
    actual_grades = [r['actual_mapped'] for r in results_summary]
    
    print(f"\n📈 GRADE DISTRIBUTION COMPARISON:")
    print("-" * 40)
    
    for grade in ["Trung bình", "Khá", "Giỏi", "Xuất sắc"]:
        actual_count = actual_grades.count(grade)
        predicted_count = predicted_grades.count(grade)
        print(f"  {grade:<12}: Actual={actual_count} | Predicted={predicted_count}")
    
    print(f"\n🎉 Test completed! Model validation with real User 5 database records.")

if __name__ == "__main__":
    test_real_user5_scenarios()
