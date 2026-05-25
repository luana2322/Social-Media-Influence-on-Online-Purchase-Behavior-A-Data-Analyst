# AI Marketing Assistant & Purchase Prediction SaaS Platform

## 🎯 Overview
A production-ready **SaaS platform** that predicts online purchase behavior using ML models trained on fused data (e-commerce + social media + product). The platform features:
- **Batch prediction** with CSV upload (10K-1M rows) and auto column mapping
- **AI Marketing Dashboard** (Next.js) with analytics and segmentation
- **Async job processing** with progress tracking
- **Multi-tenant architecture** with PostgreSQL
- **Language toggle** (EN/VI) in frontend with globe button
- **XGBoost Pipeline** bundled as sklearn Pipeline (no separate scaler/encoder)

## 📊 Model Metrics (v1.2.0)

| Metric | Test Score | CV Score (5-Fold) |
|--------|-----------|-------------------|
| **Model** | XGBoost + Isotonic Calibration | XGBoost + Isotonic Calibration |
| **ROC-AUC** | **0.9621** | **0.9622 ± 0.0006** |
| **PR-AUC** | **0.8821** | **0.8810 ± 0.0017** |
| **Accuracy** | 0.9377 | - |
| **F1-Score** | **0.7771** (0.7861†) | 0.7754 ± 0.0026 |
| **Precision** | 0.8360 | - |
| **Recall** | 0.7418 | - |
| **Optimal Threshold** | **0.36** | - |
| **Calibration (ECE)** | **0.0039** ✅ (well-calibrated) | - |

†With optimal threshold (0.36) - **F1 improved by +0.0658 vs pre-optimization**

**Model Comparison:**
- ❌ Raw XGBoost (v1.1.0): ROC-AUC 0.9609, F1 0.7203, ECE 0.0963
- ❌ XGBoost + Sigmoid: ROC-AUC 0.9622, F1 0.7822, ECE 0.0262
- ✅ **XGBoost + Isotonic: ROC-AUC 0.9621, F1 0.7771, ECE 0.0039**

**Key Features:**
- 17 features (10 numerical + 7 categorical)
- Trained on 200,000 samples (`output/final_fused_dataset.csv`)
- Class imbalance handled with `scale_pos_weight=5.48` (15.4% positive class)
- Isotonic calibration post-processing for accurate probability outputs
- Vectorized batch prediction (no loops)
- SHAP explainability support

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────┐
│                    SaaS Platform                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐      ┌──────────────────┐     ┌──────────┐   │
│  │   Frontend   │──────│  Spring Boot   │─────│  LLM     │   │
│  │   (Next.js)  │      │  (SaaS Backend)│                      │
│  └─────────────┘      └──────────────────┘                     │
│         │                      │                               │
│         │              ┌───────┴───────┐                       │
│         │              │  PostgreSQL   │                       │
│         │              │  (Multi-tenant)│                      │
│         │              └───────────────┘                       │
│         │                      │                               │
│         │             ┌──────────────┐                        │
│         └─────────────│  FastAPI     │─────────────────────────┘
│                        │  (ML Service)│
│                        └───────┬───────┘
│                                │
│                        ┌───────┴───────┐
│                        │ XGBoost     │
│                        │ Pipeline     │
│                        └───────────────┘
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User uploads CSV → Spring Boot (validation + auto column mapping with fuzzy matching)
2. Spring Boot creates async job → returns jobId immediately (no timeout)
3. Background thread processes batch → calls FastAPI `/batch_predict` (vectorized)
4. Results stored in PostgreSQL with segmentation (High/Medium/Low)
**Services (Docker):**
- `marketing-postgres` (PostgreSQL 15) - port 5432
- `marketing-ml` (FastAPI ML Service) - port 8000
- `marketing-spring` (Spring Boot API) - port 8080
- `marketing-frontend` (Next.js Dashboard) - port 3000

 ## ✨ Features
 - **Batch Prediction**: Vectorized processing (no loops) for 10K-1M row CSVs
 - **Auto Column Mapping**: Fuzzy matching (Levenshtein distance) + heuristic mapping
 - **sklearn Pipeline**: Bundles preprocessing + XGBoost model (no separate scaler/encoder)
 - **Landing Page**: High-converting homepage at `/` with hero, demo, features, and CTA
 - **Next.js Dashboard**: Modern UI with analytics, segmentation, and result visualization
 - **Language Toggle**: EN/VI toggle with globe button in Header (stored in localStorage)
 - **PDF Export**: Export analysis results to PDF with html2canvas + jsPDF
 - **Async Processing**: Spring Boot `@Async` with job tracking and progress monitoring
 - **Multi-tenant Ready**: PostgreSQL with proper indexing (no Redis caching)
 - **FastAPI Endpoints**: `/predict`, `/batch_predict`, `/health`, `/metadata`
 - **Spring Boot Backend**: REST API with reactive WebClient + retry logic
 - **Input Validation**: Pydantic (FastAPI) + Jakarta Validation (Spring Boot)
 - **Dockerized**: Multi-container setup with docker-compose (service names: marketing-postgres, marketing-ml, marketing-spring, marketing-frontend)
 - **Model Metadata**: Version tracking via `metadata.json`

 ## 🎯 Landing Page

The landing page at `/` is designed to convert visitors within 5 seconds:
 - **Hero Section**: "Stop guessing which customers will buy" + "Predict purchase behavior instantly with AI"
 - **How It Works**: 3-step visual flow (Upload → AI Predicts → Get Insights)
 - **Demo Section**: Interactive demo with sample data + pie chart (no upload required)
 - **Features Section**: 3 key features with icons (Purchase Prediction, Segmentation, Smart Analytics)
 - **Social Proof**: Tech stack (XGBoost, FastAPI, Spring Boot, Next.js) + stats
 - **Final CTA**: "Start predicting your customers today"

### Copywriting Highlights
 - **Pain**: "Stop guessing which customers will buy"
 - **Solution**: "Predict purchase behavior instantly with AI"
 - **Outcome**: "Increase conversions by 27% using intelligent customer segmentation"
 - **CTA Buttons**: "Try Demo" (scrolls to demo), "Upload Your Data" (navigates to /upload)

### Technical Implementation
 - **Components**: `HeroSection`, `HowItWorks`, `DemoSection`, `FeaturesSection`, `DirectAnalyzeCTA`, `SocialProof`, `CTASection`
 - **Location**: `src/components/landing/`
 - **i18n**: Full English/Vietnamese support with translation keys
 - **Responsive**: Mobile-first design with Tailwind CSS
 - **Charts**: Recharts for pie chart in demo section

### Pages Restructuring
 - `/` → Landing page (new)
 - `/dashboard` → Dashboard (moved from `/`)
 - Sidebar/Header hidden on landing page for cleaner look

## 🛠️ Tech Stack
| Component | Technology |
|-----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| **Backend API** | Spring Boot 4.0, Java 17, Maven, WebClient (reactive) |
| **ML Training** | Python 3.10+, scikit-learn, XGBoost, pandas, joblib |
| **ML Serving** | FastAPI, uvicorn |
| **Database** | PostgreSQL 15 |
| **PDF Export** | html2canvas, jsPDF |
| **Containerization** | Docker, docker-compose |
| **Data Source** | CSV upload (10K-1M rows, 17 features after mapping) |

## 🤖 AI Model Architecture

### Model Type: XGBoost (Extreme Gradient Boosting)
- **Selected via comparison**: Outperformed Logistic Regression & Random Forest on ROC-AUC
- **Implementation**: sklearn Pipeline bundling preprocessing + XGBoost classifier
- **Training Script**: `scripts/train_model.py`

### Pipeline Architecture
```
Input CSV (17 features)
        ↓
┌───────────────────────────────────┐
│     sklearn Pipeline              │
│                                   │
│  ┌─────────────────────────┐    │
│  │ ColumnTransformer       │    │
│  │                         │    │
│  │ ┌──────────┐ ┌────────┐│    │
│  │ │Standard  │ │OneHot  ││    │
│  │ │Scaler    │ │Encoder ││    │
│  │ │(num: 10) │ │(cat: 7)││    │
│  │ └──────────┘ └────────┘│    │
│  └─────────────────────────┘    │
│               ↓                   │
│  ┌─────────────────────────┐    │
│  │ XGBoost Classifier     │    │
│  │ (random_state=42,      │    │
│  │  eval_metric=logloss)  │    │
│  └─────────────────────────┘    │
└───────────────────────────────────┘
        ↓
Output: purchase_probability (0-1)
```

### Features (17 Total)

**Numerical Features (10)** - StandardScaler applied:
| Feature | Description |
|---------|-------------|
| `PageValues` | Average page value during session |
| `BounceRates` | Percentage of single-page visits |
| `ExitRates` | Percentage of exits from that page |
| `ProductRelated` | Number of product-related pages visited |
| `Administrative` | Number of administrative pages visited |
| `avg_sentiment` | Average social media sentiment score |
| `total_engagement` | Total social media engagement count |
| `positive_ratio` | Ratio of positive social interactions |
| `engagement_norm` | Normalized engagement score |
| `global_avg_price` | Global average product price |

**Categorical Features (7)** - OneHotEncoder (drop='first') applied:
| Feature | Values |
|---------|--------|
| `Month` | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| `OperatingSystems` | 1, 2, 3, 4, 5, 6, 7, 8 |
| `Browser` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 |
| `Region` | 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| `TrafficType` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 |
| `VisitorType` | New_Visitor, Returning_Visitor, Other |
| `Weekend` | 0 (No), 1 (Yes) |

### Training Process
1. **Data Source**: `output/final_fused_dataset.csv` (200,000 samples)
2. **Class Imbalance**: 15.4% positive class (ratio 5.48:1) → `scale_pos_weight=5.48`
3. **Train/Test Split**: 80/20 with stratification on target variable
4. **Cross-Validation**: 5-Fold Stratified K-Fold (robustness verification)
5. **Threshold Tuning**: Optimized via precision-recall curve (optimal: 0.36)
6. **Calibration**: Isotonic regression post-processing (ECE 0.0039)
7. **Random State**: 42 (reproducible results)
8. **Target Variable**: `Revenue` (binary: 0 = no purchase, 1 = purchase)

### Optimization Results (v1.1.0 → v1.2.0)
| Metric | Before (v1.1.0) | After (v1.2.0) | Δ |
|--------|-----------------|----------------|---|
| **Model** | Raw XGBoost | XGBoost + Isotonic | - |
| **ROC-AUC** | 0.9609 | **0.9621** | +0.0012 |
| **PR-AUC** | 0.8795 | **0.8821** | +0.0026 |
| **F1 (default threshold)** | 0.7203 | **0.7771** | **+0.0568** |
| **F1 (optimal threshold)** | 0.7824 | **0.7861** | +0.0037 |
| **Calibration (ECE)** | 0.0963 (poor) | **0.0039** ✅ | **-0.0925** |
| **CV ROC-AUC** | 0.9610 ± 0.0007 | **0.9622 ± 0.0006** | +0.0012 |

**Why XGBoost + Isotonic Calibration?**
- Lowest ECE (0.0039) - nearly perfectly calibrated probabilities
- Highest ROC-AUC (0.9621 test, 0.9622 CV)
- Highest F1 at default threshold (0.7771 vs 0.7203 raw)
- 5-Fold CV confirms stability (std < 0.001 for ROC-AUC)
- Calibration makes probability output reliable for business decisions

### Model Artifacts
| File | Description |
|------|-------------|
| `models/model.pkl` | Complete sklearn Pipeline (preprocessing + XGBoost + Isotonic Calibration) |
| `models/features.json` | Feature schema (names, types, order) |
| `models/metadata.json` | Model version, training date, metrics, CV scores |
| `models/evaluation_report.json` | Full comparison of raw/isotonic/sigmoid + optimal threshold |
| `models/optimal_threshold.json` | Optimal threshold (0.36) + metrics at optimal |
| `models/calibration_report.json` | Calibration analysis (ECE = 0.0039) |
| `models/calibration_plot.png` | Calibration curve visualization |

### Model Serving
- **Format**: joblib pickle (entire Pipeline object)
- **API Endpoints**:
  - `GET /health` - Health check
  - `GET /metadata` - Model metadata
  - `GET /model_info` - Comprehensive model info (calibration, threshold)
  - `POST /predict` - Single prediction (JSON input)
  - `POST /batch_predict_chunk` - Batch prediction (vectorized, no loops)
  - `POST /segment` - Segmentation using optimal threshold
  - `GET /explain` - SHAP explanation for predictions
- **Input Validation**: Pydantic schemas in FastAPI
- **Output**: `purchase_probability` (float 0-1) + model metadata + segmentation

---

## 📂 Project Structure
```
dataAna/
├── ai-marketing-dashboard/          # Next.js frontend (v16, React 19, TypeScript)
│   ├── src/
│   │   ├── app/                    # Next.js app router (dashboard, jobs, analyze)
│   │   ├── components/             # UI components (Header, UploadDropzone, ExportButton)
│   │   ├── i18n/                  # Language support (translations.ts, LanguageProvider.tsx)
│   │   └── lib/                   # API clients (api.ts)
│   ├── public/                     # Static assets
│   ├── package.json
│   └── Dockerfile
├── ml-service/                      # FastAPI ML service
│   ├── main.py                     # Endpoints: /predict, /batch_predict, /health, /metadata
│   ├── requirements.txt
│   └── Dockerfile
├── spring-app/                      # Spring Boot SaaS backend
│   ├── src/main/java/com/example/socialpurchase/
│   │   ├── controller/             # BatchJobController, DatasetController
│   │   ├── service/               # JobProducerService, JobWorkerService, RecommendationEngine
│   │   ├── client/                # MLServiceClient
│   │   ├── dto/                   # Request/Response objects
│   │   └── entity/                # JPA entities (PredictionJob, PredictionResult, Dataset)
│   ├── pom.xml
│   └── Dockerfile
├── models/                          # Trained model artifacts
│   ├── model.pkl                   # sklearn Pipeline (preprocessing + XGBoost)
│   ├── features.json               # Feature schema (names, types, order)
│   ├── metadata.json               # Model version, training date, metrics, CV scores
│   ├── evaluation_report.json     # Performance metrics (ROC-AUC, F1, PR-AUC, CV)
│   ├── optimal_threshold.json     # Optimal threshold (0.71) + metrics
│   ├── calibration_report.json   # Calibration analysis (ECE = 0.0706)
│   └── calibration_plot.png       # Calibration curve visualization
├── scripts/                         # Training & analysis scripts
│   ├── train_model.py             # Model training with CV, threshold tuning
│   └── calibration_analysis.py   # Model calibration analysis
├── scripts/                         # Training scripts
│   └── train_model.py             # Model training script
├── data/                            # Test data files
│   └── sample.csv                 # Sample CSV for testing uploads
├── output/                          # Processed data (reference only)
│   ├── final_fused_dataset.csv     # Original ML dataset (50K rows)
│   └── *.png                      # Analysis charts
├── sql/                             # Database schemas
│   └── schema.sql
├── uploads/                         # CSV upload temp storage
├── docker-compose.yml               # Orchestrates all services
├── requirements.txt                 # Python dependencies (root)
├── IMPLEMENT_PLAN_SaaS.md          # SaaS implementation plan
├── IMPLEMENTATION_PLAN_CHATBOT.md  # Chatbot system prompt plan
├── QUICKSTART.md                    # Quick start guide
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- Java 17+ (for local backend development)
- Python 3.10+ (for local ML service development)
- Node.js 18+ (for local frontend development)

### Docker Setup (Recommended)
```bash
# Ensure Docker Desktop is running first
cd /Users/luana/Ki8/DACN/dataAna
docker compose up --build -d
```
Access:
- **Frontend Dashboard**: http://localhost:3000
- **Spring Boot API**: http://localhost:8080/api
- **ML Service**: http://localhost:8000
- **PostgreSQL**: localhost:5432

Initialize database:
```bash
docker exec -i marketing-postgres psql -U postgres marketing_ai < sql/schema.sql
```

**Verify Services:**
```bash
docker ps  # Check all 4 containers are running
curl http://localhost:8000/health  # ML service (should show model_loaded: true)
curl http://localhost:8080/api/jobs/list  # Spring Boot (should return JSON array)
```

**Troubleshooting:**
- **ML Service "FileNotFoundError"**: Rebuild with `docker compose build --no-cache marketing-ml`
- **Spring Boot 404 errors**: Rebuild with `docker compose build --no-cache spring-app`
- **Model version mismatch**: Retrain model with `python3 scripts/train_model.py` (ensure scikit-learn==1.6.1)
- **Docker Compose errors**: Check service names match (marketing-ml, not ml-service)

### Local Setup (Without Docker)

**1. Train the ML Model:**
```bash
pip install -r requirements.txt
python3 scripts/train_model.py
```
Output: `models/model.pkl`, `models/features.json`, `models/metadata.json`

**2. Start FastAPI ML Service (Terminal 1):**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**3. Start Spring Boot Backend (Terminal 2):**
```bash
cd spring-app
mvn spring-boot:run
```

**4. Start Next.js Frontend (Terminal 3):**
```bash
cd ai-marketing-dashboard
npm install
npm run dev
```
Frontend: http://localhost:3000

## 📡 API Documentation

### FastAPI ML Service (Port 8000)

#### Health Check
```bash
curl http://localhost:8000/health
```

#### Model Metadata
```bash
curl http://localhost:8000/metadata
```

#### Single Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "PageValues": 50.0,
    "BounceRates": 0.02,
    "ExitRates": 0.05,
    "ProductRelated": 30.0,
    "Administrative": 5.0,
    "avg_sentiment": 0.7,
    "total_engagement": 100.0,
    "positive_ratio": 0.8,
    "engagement_norm": 0.6,
    "global_avg_price": 120.0,
    "Month": "May",
    "OperatingSystems": 2,
    "Browser": 3,
    "Region": 3,
    "TrafficType": 2,
    "VisitorType": "Returning_Visitor",
    "Weekend": 0
  }'
```

#### Batch Prediction (Vectorized)
```bash
curl -X POST http://localhost:8000/batch_predict \
  -H "Content-Type: application/json" \
  -d '{
    "records": [...],
    "job_id": 1
  }'
```

### Spring Boot API (Port 8080)

#### Upload CSV & Start Batch Job
```bash
curl -X POST http://localhost:8080/api/jobs/upload \
  -F "file=@your_dataset.csv"
# Returns: {"jobId": 1, "status": "pending"}
```

#### Check Job Status
```bash
curl http://localhost:8080/api/jobs/{jobId}
# Returns: {"jobId": 1, "status": "completed", "progress": 100, ...}
```

#### List All Jobs
```bash
curl http://localhost:8080/api/jobs/list?limit=10
# Returns: Array of job objects
```

#### Get Prediction Results (Paginated)
```bash
curl http://localhost:8080/api/jobs/{jobId}/results
# Returns: Array of prediction results
```

#### Health Check
```bash
curl http://localhost:8080/api/actuator/health
```

**Note**: Endpoints return 404 if Spring Boot JAR doesn't include controllers. Rebuild with `docker compose build --no-cache spring-app` if needed.

## 📊 Model Performance
| Metric | Score (Test) | CV Score (5-Fold) |
|--------|---------------|-------------------|
| **Best Model** | XGBoost + Isotonic Calibration | XGBoost + Isotonic Calibration |
| **ROC-AUC** | **0.9621** | **0.9622 ± 0.0006** |
| **PR-AUC** | **0.8821** | **0.8810 ± 0.0017** |
| **Accuracy** | **0.9377** | - |
| **F1-Score** | 0.7771 (0.7861†) | 0.7754 ± 0.0026 |
| **Precision** | 0.8360 | - |
| **Recall** | 0.7418 | - |
| **Optimal Threshold** | **0.36** | - |
| **Calibration (ECE)** | **0.0039** ✅ | - |

†With optimal threshold (0.36)

**Model Comparison:**
- Raw XGBoost (v1.1.0): ROC-AUC 0.9609, F1 0.7203, ECE 0.0963
- XGBoost + Sigmoid: ROC-AUC 0.9622, F1 0.7822, ECE 0.0262
- **XGBoost + Isotonic: ROC-AUC 0.9621, F1 0.7771, ECE 0.0039** ✅

**Key Improvements (v1.2.0):**
- ✅ Isotonic calibration: ECE dropped from 0.0963 → **0.0039** (96% reduction)
- ✅ ROC-AUC improved from 0.9609 → **0.9621**
- ✅ F1 at default threshold improved from 0.7203 → **0.7771** (+0.0568)
- ✅ Reliable probability outputs for business decisions

See `models/evaluation_report.json` and `models/calibration_report.json` for full details.

## 📁 Data Source & Features

**Input:** CSV upload (10K-1M rows) with auto column mapping via fuzzy matching.

**Target Variable:** `Revenue` (binary: 0 = no purchase, 1 = purchase)

**Key Features (17 after mapping):**
- Numerical: PageValues, BounceRates, ExitRates, ProductRelated, Administrative, avg_sentiment, total_engagement, positive_ratio, engagement_norm, global_avg_price
- Categorical: Month, OperatingSystems, Browser, Region, TrafficType, VisitorType, Weekend

**Output Segmentation:** High (≥0.8), Medium (optimal_threshold 0.71-0.8), Low (<0.71) purchase probability

## 🧪 Testing
Run the test script to verify all endpoints:
```bash
bash scripts/test_endpoints.sh
```

**Test Coverage:**
- ✅ ML Service health check & metadata
- ✅ Single & batch prediction endpoints
- ✅ CSV upload & job creation
- ✅ Job status & results pagination
- ✅ Invalid input handling

**Manual Testing:**
```bash
# Test FastAPI directly
curl http://localhost:8000/health

# Test batch job flow
curl -X POST http://localhost:8080/api/jobs/upload -F "file=@dataset.csv"
curl http://localhost:8080/api/jobs/1
```

## 🌐 Language Toggle
The frontend supports **English (EN) and Vietnamese (VI)** with:
- Globe button in Header for visual toggle
- `ai-marketing-dashboard/src/i18n/translations.ts` - Translation keys for all UI text
- `ai-marketing-dashboard/src/i18n/LanguageProvider.tsx` - React context for language state
- Language preference stored in `localStorage` for persistence
- Default language: English

## 📖 References
- **SaaS Implementation Plan**: `IMPLEMENT_PLAN_SaaS.md`
- **Quick Start Guide**: `QUICKSTART.md`

- **Model Schema**: `models/features.json`
- **Model Metadata**: `models/metadata.json`
- **Training Script**: `scripts/train_model.py`
- **Frontend README**: `ai-marketing-dashboard/README.md`

## 📝 Notes
- Model is saved as a **sklearn Pipeline** (no separate scaler/encoder files)
- **Vectorized batch prediction** - no loops, converts to DataFrame once
- **Async processing** with Spring Boot `@Async` + job progress tracking
- **No Redis caching** - uses PostgreSQL with proper indexing instead
- Spring Boot uses **WebClient** with exponential backoff retry (max 3 attempts)
- **Auto column mapping** with fuzzy matching (Levenshtein distance ≤3)
- Multi-tenant ready with PostgreSQL schema

## 🎓 Academic Context
This project demonstrates:
- Data fusion techniques (e-commerce + social media + product data)
- ML model training with imbalanced data handling (`scale_pos_weight`)
- Model evaluation best practices (5-Fold CV, PR-AUC, calibration analysis)
- Threshold optimization for business metrics (F1-score improvement)
- Production-ready SaaS platform design
- Batch ML prediction at scale (vectorized processing)
- Microservices architecture (Python ML + Java Backend + Next.js Frontend)
- PDF export with html2canvas + jsPDF
- Docker containerization & PostgreSQL persistence

---
**Status:** ✅ Core Features Complete, Model Optimized (v1.2.0)  
**Completed:**
- ✅ AI Model Training (XGBoost, ROC-AUC 0.9621 test, 0.9622 CV)
- ✅ Class Imbalance Handling (`scale_pos_weight=5.48`)
- ✅ 5-Fold Cross-Validation (stable performance: std <0.001)
- ✅ Isotonic Calibration (ECE 0.0039 — well-calibrated ✅)
- ✅ Threshold Tuning (0.36, F1 0.7861)
- ✅ ML Service API (FastAPI with /predict, /batch_predict, /model_info, /explain)
- ✅ Spring Boot Backend (BatchJobController, DatasetController, ChatbotController)
- ✅ Next.js Frontend (Dashboard, Upload, Analyze, Language Toggle EN/VI)
- ✅ Docker Compose Setup (4 services: postgres, marketing-ml, marketing-spring, marketing-frontend)
- ✅ Model Version Upgrade (v1.0.0 → v1.2.0)

**Model Metrics (v1.2.0):**
- ROC-AUC: 0.9622 (CV) | **0.9621** (test)
- F1-Score: **0.7771** (default) | **0.7861** (optimal threshold 0.36)
- PR-AUC: 0.8810 (CV) | **0.8821** (test)
- Calibration ECE: **0.0039** ✅ (well-calibrated — 96% improvement)

**Next Steps:**
1. Confirm all Docker services running: `docker ps`
2. Test ML service: `curl http://localhost:8000/health`
3. Test model info: `curl http://localhost:8000/model_info`
4. Test CSV upload: `curl -X POST -F "file=@data/sample.csv" http://localhost:8080/api/jobs/upload`
  5. Verify frontend: http://localhost:3000 (test language toggle EN/VI)
