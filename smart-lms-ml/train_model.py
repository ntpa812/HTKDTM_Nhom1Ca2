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
        # ✅ FIX: Query chỉ lấy các columns còn lại (không có DeviceType, SatisfactionLevel)
        query = """
        SELECT StudyHours, AssignmentCompletionRate, QuizScore_Avg, 
               PlatformEngagement_Minutes, LearningStyle, Motivation, StressLevel, FinalGrade 
        FROM StudentBehaviors
        """
        df = pd.read_sql(query, cnxn)
        cnxn.close()
        print(f"✅ Đọc thành công {len(df)} dòng dữ liệu.")
        return df
    except Exception as e:
        print(f"❌ Lỗi khi đọc dữ liệu: {e}")
        return None

def preprocess_data(df):
    """Hàm tiền xử lý dữ liệu để chuẩn bị cho mô hình."""
    print("\nBắt đầu tiền xử lý dữ liệu...")
    
    # ✅ Debug: Kiểm tra dữ liệu thực tế
    print(f"📊 Tổng số dòng: {len(df)}")
    print(f"📊 LearningStyle unique values: {sorted(df['LearningStyle'].unique())}")
    print(f"📊 FinalGrade range: {df['FinalGrade'].min()} - {df['FinalGrade'].max()}")
    print(f"📊 FinalGrade unique values: {sorted(df['FinalGrade'].unique())}")
    print(f"📊 FinalGrade distribution:\n{df['FinalGrade'].value_counts().sort_index()}")
    
    # ✅ Xử lý LearningStyle
    df['LearningStyle'] = df['LearningStyle'].fillna('0')
    
    try:
        df['LearningStyle'] = df['LearningStyle'].astype(str).str.strip()
        df['LearningStyle'] = pd.to_numeric(df['LearningStyle'], errors='coerce')
        df['LearningStyle'] = df['LearningStyle'].fillna(0).astype(int)
    except:
        print("⚠️  Warning: LearningStyle contains non-numeric values, converting to categories")
        df['LearningStyle'] = df['LearningStyle'].astype('category').cat.codes
    
    print(f"📊 LearningStyle after processing: {sorted(df['LearningStyle'].unique())}")
    
    # ✅ FIX: Logic phân loại đúng theo thang 4.0
    def grade_to_label(grade):
        """
        Phân loại grade theo thang 4.0 chuẩn giáo dục
        4.0 = Xuất sắc, 3.0 = Khá, 2.0 = Trung bình, 1.0 = Yếu, 0.0 = Kém
        """
        if pd.isna(grade):
            return 'Yếu'
        
        if grade >= 3.5: return 'Xuất sắc'        # 3.5-4.0 = A/A+  
        elif grade >= 2.5: return 'Giỏi'       # 2.5-3.4 = B
        elif grade >= 1.5: return 'Khá' # 1.5-2.4 = C
        elif grade >= 0.5: return 'Trung bình'       # 0.5-1.4 = D
        else: return 'Trung bình'                    # 0.0-0.4 = F

    df['GradeLabel'] = df['FinalGrade'].apply(grade_to_label)
    
    # ✅ Phân loại features
    numeric_features = ['StudyHours', 'AssignmentCompletionRate', 'QuizScore_Avg', 
                       'PlatformEngagement_Minutes', 'Motivation', 'StressLevel']
    categorical_features = ['LearningStyle']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ],
        remainder='drop'
    )
    
    feature_columns = numeric_features + categorical_features
    X = df[feature_columns].copy()
    y = df['GradeLabel']
    
    print(f"📊 Features shape: {X.shape}")
    print(f"📊 Target distribution:\n{y.value_counts()}")
    print("✅ Tiền xử lý hoàn tất.")
    
    return X, y, preprocessor

def train_and_save_models(X, y, preprocessor):
    """Hàm huấn luyện và lưu cả hai mô hình K-Means và Random Forest."""
    
    # --- Mô hình 1: K-Means Clustering ---
    print("\n--- Huấn luyện mô hình Phân cụm K-Means ---")
    
    kmeans_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('cluster', KMeans(n_clusters=4, random_state=42, n_init=10))
    ]) 
    
    kmeans_pipeline.fit(X)
    print("✅ Huấn luyện K-Means hoàn tất.")
    
    # Lưu pipeline của K-Means
    joblib.dump(kmeans_pipeline, 'student_cluster_model.pkl')
    print("💾 Mô hình Phân cụm đã được lưu vào file 'student_cluster_model.pkl'")

    # --- Mô hình 2: Random Forest Classifier ---
    print("\n--- Huấn luyện mô hình Dự đoán Random Forest ---")

    # Kiểm tra distribution của target
    print(f"📊 Target classes: {y.value_counts()}")
    
    # Chia dữ liệu - chỉ stratify nếu có nhiều hơn 1 class
    unique_classes = y.nunique()
    if unique_classes > 1:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        print("⚠️  Warning: Chỉ có 1 class trong target, không thể stratify")
    
    # Tạo pipeline cho Random Forest
    rf_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
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
