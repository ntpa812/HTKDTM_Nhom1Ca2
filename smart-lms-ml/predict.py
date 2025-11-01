import pandas as pd
import joblib
import sys
import json

# --- HÀM CHÍNH ĐỂ DỰ ĐOÁN ---

def predict(student_data):
    """
    Hàm nhận dữ liệu của một sinh viên, tải các mô hình đã huấn luyện
    và trả về kết quả dự đoán.
    """
    try:
        # 1. Tải các mô hình đã được lưu
        cluster_model = joblib.load('student_cluster_model.pkl')
        grade_model = joblib.load('grade_prediction_model.pkl')

        # 2. Chuyển đổi dữ liệu đầu vào thành DataFrame của pandas
        # Dữ liệu được truyền vào dưới dạng một dictionary
        df = pd.DataFrame([student_data])

        # 3. Thực hiện dự đoán
        # Lưu ý: Chúng ta không cần y (biến mục tiêu) khi dự đoán
        cluster_prediction = cluster_model.predict(df)
        grade_prediction = grade_model.predict(df)
        grade_probabilities = grade_model.predict_proba(df)

        # 4. Lấy danh sách các lớp (categories) từ mô hình
        grade_classes = grade_model.classes_

        # Tạo một dictionary xác suất
        # Ví dụ: {'Giỏi': 0.1, 'Khá': 0.8, 'Trung bình': 0.1, 'Yếu': 0.0}
        probabilities_dict = dict(zip(grade_classes, grade_probabilities[0]))

        # 5. Chuẩn bị kết quả đầu ra
        result = {
            'status': 'success',
            'cluster': int(cluster_prediction[0]),
            'predicted_grade': grade_prediction[0],
            'probabilities': probabilities_dict
        }
        return result

    except Exception as e:
        # Nếu có lỗi, trả về một dictionary lỗi
        result = {
            'status': 'error',
            'message': str(e)
        }
        return result

# --- ĐIỂM VÀO CỦA SCRIPT ---

if __name__ == "__main__":
    # Script này sẽ được gọi từ Node.js
    # Dữ liệu sẽ được truyền vào dưới dạng một chuỗi JSON qua tham số dòng lệnh
    if len(sys.argv) > 1:
        # Đọc chuỗi JSON từ tham số đầu vào
        input_data_json = sys.argv[1]
        
        # Parse chuỗi JSON thành dictionary
        input_data = json.loads(input_data_json)
        
        # Gọi hàm dự đoán
        prediction_result = predict(input_data)
        
        # In kết quả dưới dạng chuỗi JSON ra standard output
        # Node.js sẽ "bắt" lấy chuỗi này
        print(json.dumps(prediction_result))
    else:
        # Trường hợp script được chạy mà không có dữ liệu
        error_result = {
            'status': 'error',
            'message': 'No input data provided.'
        }
        print(json.dumps(error_result))
