# Project môn Hệ thống kinh doanh thông minh

          ┌────────────────────┐
          │      CLIENT        │
          │────────────────────│
          │  • Web (ReactJS)   │
          │  • Mobile (Android │
          │    / Flutter)      │
          └─────────┬──────────┘
                    │  Request/Response (REST API / HTTPS)
                    ▼
          ┌────────────────────┐
          │      BACKEND       │
          │────────────────────│
          │  • Spring Boot /   │
          │    Django REST API │
          │  • Auth, API,      │
          │    Business Logic  │
          └─────────┬──────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
    ┌─────────────────┐      ┌────────────────────┐
    │    DATABASE     │      │    AI ENGINE       │
    │─────────────────│      │────────────────────│
    │ • MySQL/Postgres│      │ • ML Models        │
    │   (dữ liệu user,│      │   (Recommendation, │
    │    tiến độ)     │      │   Prediction)      │
    │ • MongoDB       │      │ • TensorFlow/      │
    │   (nội dung học)│      │   PyTorch/Scikit   │
    └─────────┬───────┘      └─────────┬──────────┘
              │                         │
              └──────────────┬──────────┘
                             │ (Data Flow: lưu kết quả, lấy dữ liệu huấn luyện)
                             ▼
                    ┌────────────────────┐
                    │   CI/CD PIPELINE   │
                    │────────────────────│
                    │ • Jenkins (Build,  │
                    │   Test, Deploy)    │
                    │ • Docker/K8s       │
                    │ • Cloud (AWS/GCP)  │
                    └────────────────────┘
    
