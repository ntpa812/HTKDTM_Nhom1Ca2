import pandas as pd
import joblib
import sys
import json
import os

# --- HÀM CHÍNH ĐỂ DỰ ĐOÁN ---

def predict(student_data):
    """
    Hàm nhận dữ liệu của một sinh viên, tải các mô hình đã huấn luyện
    và trả về kết quả dự đoán.
    """
    try:
        # 1. Lấy đường dẫn thư mục hiện tại của script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 2. Tạo đường dẫn tuyệt đối tới các file model
        cluster_model_path = os.path.join(current_dir, 'student_cluster_model.pkl')
        grade_model_path = os.path.join(current_dir, 'grade_prediction_model.pkl')
        
        # 3. Kiểm tra xem file có tồn tại không
        if not os.path.exists(cluster_model_path):
            raise FileNotFoundError(f"Không tìm thấy file: {cluster_model_path}")
        if not os.path.exists(grade_model_path):
            raise FileNotFoundError(f"Không tìm thấy file: {grade_model_path}")

        # 4. Tải các mô hình với đường dẫn tuyệt đối
        cluster_model = joblib.load(cluster_model_path)
        grade_model = joblib.load(grade_model_path)

        # 5. Chuyển đổi dữ liệu đầu vào thành DataFrame
        df = pd.DataFrame([student_data])

        # 6. Thực hiện dự đoán
        cluster_prediction = cluster_model.predict(df)
        grade_prediction = grade_model.predict(df)
        grade_probabilities = grade_model.predict_proba(df)

        # 7. Lấy danh sách các lớp từ mô hình
        grade_classes = grade_model.classes_
        probabilities_dict = dict(zip(grade_classes, grade_probabilities[0]))

        # 8. Kết quả đầu ra
        result = {
            'status': 'success',
            'cluster': int(cluster_prediction[0]),
            'predicted_grade': grade_prediction[0],
            'probabilities': probabilities_dict,
            'debug_info': {
                'script_dir': current_dir,
                'cluster_model_exists': os.path.exists(cluster_model_path),
                'grade_model_exists': os.path.exists(grade_model_path)
            }
        }
        return result

    except FileNotFoundError as e:
        result = {
            'status': 'error',
            'error_type': 'FileNotFoundError',
            'message': str(e),
            'debug_info': {
                'script_dir': os.path.dirname(os.path.abspath(__file__)),
                'expected_files': ['student_cluster_model.pkl', 'grade_prediction_model.pkl']
            }
        }
        return result
    except Exception as e:
        result = {
            'status': 'error',
            'error_type': type(e).__name__,
            'message': str(e)
        }
        return result

# --- ĐIỂM VÀO CỦA SCRIPT ---

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data_json = sys.argv[1]
            input_data = json.loads(input_data_json)
            prediction_result = predict(input_data)
            print(json.dumps(prediction_result))
        except json.JSONDecodeError as e:
            error_result = {
                'status': 'error',
                'error_type': 'JSONDecodeError',
                'message': f'Invalid JSON input: {str(e)}'
            }
            print(json.dumps(error_result))
    else:
        error_result = {
            'status': 'error',
            'error_type': 'NoInputData',
            'message': 'No input data provided.'
        }
        print(json.dumps(error_result))
