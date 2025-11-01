import os
import pandas as pd
import pyodbc
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# --- 1. CẤU HÌNH VÀ KẾT NỐI CSDL ---

dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'smart-lms-backend', '.env')
load_dotenv(dotenv_path=dotenv_path)

DB_SERVER = os.getenv('DB_SERVER')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = os.getenv('DB_PORT')


conn_str = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={DB_SERVER},{DB_PORT};'
    f'DATABASE={DB_NAME};'
    f'UID={DB_USER};'
    f'PWD={DB_PASSWORD};'
)

def fetch_data():
    """Hàm đọc dữ liệu từ bảng StudentBehaviors."""
    print("Bắt đầu đọc dữ liệu từ CSDL MSSQL...")
    try:
        cnxn = pyodbc.connect(conn_str)
        query = "SELECT UserID, StudyHours, AssignmentCompletionRate, QuizScore_Avg, PlatformEngagement_Minutes, LearningStyle, Motivation, StressLevel, FinalGrade FROM StudentBehaviors"
        df = pd.read_sql(query, cnxn)
        cnxn.close()
        print(f"✅ Đọc thành công {len(df)} dòng dữ liệu.")
        return df
    except Exception as e:
        print(f"❌ Lỗi khi đọc dữ liệu: {e}")
        return None

# --- 2. TIỀN XỬ LÝ DỮ LIỆU ---

def preprocess_data(df):
    """Hàm tiền xử lý dữ liệu để chuẩn bị cho mô hình."""
    print("\nBắt đầu tiền xử lý dữ liệu...")
    
    # Xác định các cột số và cột phân loại
    numeric_features = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 'PlatformEngagement_Minutes', 'Motivation', 'StressLevel']
    categorical_features = ['LearningStyle']
    
    # Tạo một "đường ống" xử lý:
    # - Với cột số: Chuẩn hóa (đưa về cùng một thang đo)
    # - Với cột phân loại: Mã hóa One-Hot (biến 'Visual', 'Auditory' thành các cột 0/1)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    # Chuyển đổi cột mục tiêu 'FinalGrade' thành các nhãn số
    # Giả sử điểm là từ 0-100
    def grade_to_label(grade):
        if grade >= 85: return 'Giỏi'
        if grade >= 70: return 'Khá'
        if grade >= 50: return 'Trung bình'
        return 'Yếu'

    df['GradeLabel'] = df['FinalGrade'].apply(grade_to_label)
    
    X = df.drop(columns=['UserID', 'FinalGrade', 'GradeLabel'])
    y = df['GradeLabel']
    
    print("✅ Tiền xử lý hoàn tất.")
    return X, y, preprocessor

# --- 3. HUẤN LUYỆN VÀ LƯU MÔ HÌNH ---

def train_and_save_models(X, y, preprocessor):
    """Hàm huấn luyện và lưu cả hai mô hình K-Means và Random Forest."""
    
    # --- Mô hình 1: K-Means Clustering ---
    print("\n--- Huấn luyện mô hình Phân cụm K-Means ---")
    
    # Tạo pipeline cho K-Means: Tiền xử lý -> Chạy thuật toán
    # Chúng ta sẽ chia sinh viên thành 4 nhóm
    kmeans_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                      ('cluster', KMeans(n_clusters=4, random_state=42, n_init=10))]) 
    
    kmeans_pipeline.fit(X)
    print("✅ Huấn luyện K-Means hoàn tất.")
    
    # Lưu pipeline của K-Means
    joblib.dump(kmeans_pipeline, 'student_cluster_model.pkl')
    print("💾 Mô hình Phân cụm đã được lưu vào file 'student_cluster_model.pkl'")

    # --- Mô hình 2: Random Forest Classifier ---
    print("\n--- Huấn luyện mô hình Dự đoán Random Forest ---")

    # Chia dữ liệu thành tập huấn luyện (80%) và tập kiểm thử (20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Tạo pipeline cho Random Forest: Tiền xử lý -> Chạy thuật toán
    rf_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                  ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])
    
    rf_pipeline.fit(X_train, y_train)
    print("✅ Huấn luyện Random Forest hoàn tất.")
    
    # Đánh giá độ chính xác của mô hình trên tập kiểm thử
    y_pred = rf_pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n📊 Độ chính xác trên tập kiểm thử: {accuracy:.2f}")
    print("📄 Báo cáo phân loại chi tiết:")
    print(classification_report(y_test, y_pred))

    # Lưu pipeline của Random Forest
    joblib.dump(rf_pipeline, 'grade_prediction_model.pkl')
    print("💾 Mô hình Dự đoán đã được lưu vào file 'grade_prediction_model.pkl'")


# --- CHẠY CHÍNH ---
if __name__ == "__main__":
    df = fetch_data()
    if df is not None:
        X, y, preprocessor = preprocess_data(df)
        train_and_save_models(X, y, preprocessor)
