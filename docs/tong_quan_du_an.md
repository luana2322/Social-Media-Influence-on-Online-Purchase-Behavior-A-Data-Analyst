# Tổng quan dự án — AI Marketing Assistant & Purchase Prediction SaaS

## Mô tả

Nền tảng SaaS dự đoán hành vi mua hàng trực tuyến sử dụng ML model (XGBoost) trained trên dữ liệu fused (e-commerce + social media + product). Người dùng upload CSV khách hàng, hệ thống tự động phân tích và trả về xác suất mua hàng, phân khúc (hot/warm/cold), và gợi ý phát triển.

## Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────────┐
│                    dataAna (SaaS Platform)                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐     ┌──────────────────┐           │
│  │  Frontend        │─────│  Spring Boot      │           │
│  │  (Next.js 16)    │     │  (Java 17)        │           │
│  │  Port 3000       │     │  Port 8080        │           │
│  └─────────────────┘     └───────┬────────────┘           │
│         │                        │                        │
│         │                ┌───────┴───────┐                │
│         │                │  PostgreSQL   │                │
│         │                │  Port 5432    │                │
│         │                └───────────────┘                │
│         │                        │                        │
│         │                ┌───────┴───────┐                │
│         └────────────────│  FastAPI     │─────────────────│
│                          │  (Python)    │                 │
│                          │  Port 8000   │                 │
│                          └───────┬───────┘                │
│                                  │                        │
│                          ┌───────┴───────┐                │
│                          │  XGBoost     │                 │
│                          │  Pipeline     │                 │
│                          └───────────────┘                │
└──────────────────────────────────────────────────────────┘
```

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Recharts |
| **Backend API** | Spring Boot 3.2, Java 17, Maven |
| **ML Service** | FastAPI, uvicorn, XGBoost, scikit-learn |
| **Database** | PostgreSQL 15 |
| **Container** | Docker, docker-compose |

## Các services (Docker)

| Service | Image | Port | Mô tả |
|---------|-------|------|-------|
| `marketing-postgres` | postgres:15-alpine | 5432 | Database PostgreSQL |
| `marketing-ml` | FastAPI (Python) | 8000 | ML prediction endpoints |
| `marketing-spring` | Spring Boot | 8080 | REST API backend |
| `marketing-frontend` | Next.js | 3000 | Dashboard UI |

## Tính năng chính

1. **Upload CSV & Batch Prediction** — Upload file CSV (10K-1M rows), tự động ánh xạ cột, dự đoán hàng loạt
2. **Phân khúc khách hàng** — Chia thành 3 nhóm: Hot (>80%), Warm (50-80%), Cold (<50%)
3. **Dashboard phân tích** — Biểu đồ phân bố segment, chuyển đổi theo kênh, phân bố theo thời gian
4. **Gợi ý phát triển** — Đề xuất hành động marketing dựa trên kết quả phân tích
5. **Bài viết tham khảo** — Tìm kiếm bài viết marketing liên quan (Serper API + fallback)
6. **Xuất PDF** — Export kết quả phân tích ra file PDF
7. **Hỗ trợ song ngữ** — Chuyển đổi EN/VI
8. **Landing page** — Trang giới thiệu sản phẩm với demo tương tác

## Luồng xử lý dữ liệu

```
User upload CSV
       ↓
Spring Boot nhận file → validation → auto map cột
       ↓
Tạo async job → trả về jobId ngay lập tức
       ↓
Background thread xử lý batch → gọi FastAPI /batch_predict
       ↓
FastAPI load model.pkl → predict_proba() → trả về probability (0-1)
       ↓
Spring Boot lưu kết quả vào PostgreSQL + phân khúc High/Medium/Low
       ↓
Frontend poll job status → hiển thị kết quả + recommendations + articles
```

## ML Model

- **Model**: XGBoost + Isotonic Calibration (sklearn Pipeline)
- **Features**: 17 features (10 numerical + 7 categorical)
- **Training data**: 200,000 samples (từ Data Fusion)
- **ROC-AUC**: 0.9621 (test), 0.9622 (CV)
- **F1**: 0.7771 (default threshold), 0.7861 (optimal threshold 0.36)
- **Calibration ECE**: 0.0039 (well-calibrated)
- **Threshold phân khúc**: >0.8 → High, >0.36 → Medium, còn lại → Low

## Cấu trúc thư mục

```
dataAna/
├── ai-marketing-dashboard/     # Next.js frontend
│   ├── src/app/               # Pages (analyze, overview, history, settings...)
│   ├── src/components/        # UI components (recommendations, overview, ui...)
│   ├── src/lib/               # Utilities (csv-utils, api, recommendation-search)
│   ├── src/i18n/              # EN/VI translations
│   └── src/types/             # TypeScript type definitions
├── spring-app/                 # Spring Boot backend
│   └── src/main/java/com/example/socialpurchase/
│       ├── controller/        # REST API controllers
│       ├── service/           # Business logic (RecommendationEngine, JobWorker...)
│       ├── client/            # HTTP clients (MLServiceClient)
│       ├── entity/            # JPA entities (PredictionJob, PredictionResult...)
│       ├── dto/               # Data transfer objects
│       └── repository/        # Database repositories
├── ml-service/                 # FastAPI ML service
│   └── main.py               # Endpoints: /predict, /batch_predict, /health...
├── models/                     # Trained model artifacts
│   ├── model.pkl             # sklearn Pipeline (preprocessing + XGBoost)
│   ├── features.json         # Feature schema
│   └── metadata.json         # Model version & metrics
├── scripts/                    # Training scripts
├── sql/                        # Database schema
├── data/                       # Sample CSV data
└── docs/                       # Tài liệu dự án
```

## API Endpoints

### ML Service (Port 8000)
- `GET /health` — Health check
- `GET /metadata` — Model metadata
- `POST /predict` — Single prediction
- `POST /batch_predict_chunk` — Batch prediction (vectorized)
- `POST /segment` — Phân khúc theo threshold
- `GET /explain` — SHAP explanation

### Spring Boot API (Port 8080)
- `POST /api/jobs/upload` — Upload CSV
- `GET /api/jobs/{id}` — Check job status
- `GET /api/jobs/{id}/results` — Get prediction results
- `GET /api/jobs/list` — List all jobs
- `POST /api/jobs/{id}/analysis-summary` — Save analysis summary
- `GET /api/jobs/{id}/analysis-summary` — Get analysis summary

### Next.js API Routes (Port 3000)
- `POST /api/recommendations/search` — Search reference articles (Serper API + fallback)

## Database (PostgreSQL)

Các bảng chính:
- `prediction_jobs` — Job upload, status, progress
- `prediction_results` — Kết quả dự đoán chi tiết từng record
- `datasets` — Thông tin dataset đã upload
- `analysis_summary` — Tổng hợp phân tích (segments, channels, recommendations)
- `users` — Người dùng (multi-tenant)
- `chatbot_conversations` — Lịch sử chat

## Deploy

```bash
docker compose up --build -d
```

4 containers sẽ chạy: PostgreSQL → ML Service → Spring Boot → Frontend.
