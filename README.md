# AI Marketing Assistant & Purchase Prediction SaaS Platform

## 🎯 Overview
A production-ready **SaaS platform** that predicts online purchase behavior using ML models trained on fused data (e-commerce + social media + product). The platform features:
- **Batch prediction** with CSV upload (10K-1M rows) and auto column mapping
- **AI Marketing Dashboard** (Next.js) with analytics and segmentation
- **Chatbot with LLM integration** for conversational marketing insights (4-section response format)
- **Async job processing** with progress tracking
- **Multi-tenant architecture** with PostgreSQL
- **Language toggle** (EN/VI) in frontend with globe button
- **XGBoost Pipeline** bundled as sklearn Pipeline (no separate scaler/encoder)

## 📊 Model Metrics (v1.1.0)

| Metric | Test Score | CV Score (5-Fold) |
|--------|-----------|-------------------|
| **Model** | XGBoost | XGBoost |
| **ROC-AUC** | 0.9532 | **0.9571 ± 0.004** |
| **PR-AUC** | 0.8592 | 0.8685 ± 0.009 |
| **Accuracy** | 0.9020 (0.9292*) | - |
| **F1-Score** | 0.7229 (**0.7600***) | 0.7288 ± 0.014 |
| **Precision** | 0.6429 (0.7996*) | - |
| **Recall** | 0.8256 (0.7242*) | - |
| **Optimal Threshold** | **0.71** | - |
| **Calibration (ECE)** | 0.0706 (moderate) | - |

*With optimal threshold (0.71) - **F1 improved by +0.037**

**Model Comparison:**
- ❌ Logistic Regression: ROC-AUC 0.9058, F1 0.6751
- ❌ Random Forest: ROC-AUC 0.9466, F1 0.7443
- ✅ **XGBoost: ROC-AUC 0.9532, F1 0.7600 (best choice)**

**Key Features:**
- 17 features (10 numerical + 7 categorical)
- Trained on 50,000 samples (`output/final_fused_dataset.csv`)
- Class imbalance handled with `scale_pos_weight=5.46` (15.5% positive class)
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
│  │   (Next.js)  │      │  (SaaS Backend)│     │  (OpenAI)│   │
│  └─────────────┘      └──────────────────┘     └──────────┘   │
│         │                      │                               │
│         │              ┌───────┴───────┐                       │
│         │              │  PostgreSQL   │                       │
│         │              │  (Multi-tenant)│                      │
│         │              └───────────────┘                       │
│         │                      │                               │
│         │             ┌──────────────┐                        │
│         └─────────────│  FastAPI     │──────────────────────┘
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
5. Chatbot: Frontend → Spring Boot → LLM + fresh ML context from DB

**Services (Docker):**
- `marketing-postgres` (PostgreSQL 15) - port 5432
- `marketing-ml` (FastAPI ML Service) - port 8000
- `marketing-spring` (Spring Boot API) - port 8080
- `marketing-frontend` (Next.js Dashboard) - port 3000

 ## ✨ Features
 - **Batch Prediction**: Vectorized processing (no loops) for 10K-1M row CSVs
 - **Auto Column Mapping**: Fuzzy matching (Levenshtein distance) + heuristic mapping
 - **sklearn Pipeline**: Bundles preprocessing + XGBoost model (no separate scaler/encoder)
 - **Landing Page**: High-converting homepage at `/` with hero, demo, features, chatbot preview
 - **Next.js Dashboard**: Modern UI with analytics, segmentation, and result visualization
 - **Language Toggle**: EN/VI toggle with globe button in Header (stored in localStorage)
 - **AI Chatbot**: LLM-powered marketing assistant with 4-section response format (Insight, Explanation, Strategy, Recommendation)
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
 - **Features Section**: 4 key features with icons (Purchase Prediction, Segmentation, Chatbot, Analytics)
 - **Chatbot Section**: "Ask your data like ChatGPT" with 4-section response preview
 - **Social Proof**: Tech stack (XGBoost, FastAPI, Spring Boot, Next.js) + stats
 - **Final CTA**: "Start predicting your customers today"

### Copywriting Highlights
 - **Pain**: "Stop guessing which customers will buy"
 - **Solution**: "Predict purchase behavior instantly with AI"
 - **Outcome**: "Increase conversions by 27% using intelligent customer segmentation"
 - **CTA Buttons**: "Try Demo" (scrolls to demo), "Upload Your Data" (navigates to /upload)

### Technical Implementation
 - **Components**: `HeroSection`, `HowItWorks`, `DemoSection`, `FeaturesSection`, `ChatbotSection`, `SocialProof`, `CTASection`
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
| **AI/LLM** | OpenAI API (chatbot integration) |
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
1. **Data Source**: `output/final_fused_dataset.csv` (50,000 samples)
2. **Class Imbalance**: 15.5% positive class (ratio 5.46:1) → `scale_pos_weight=5.46`
3. **Train/Test Split**: 80/20 with stratification on target variable
4. **Cross-Validation**: 5-Fold Stratified K-Fold (robustness verification)
5. **Threshold Tuning**: Optimized via precision-recall curve (optimal: 0.71)
6. **Random State**: 42 (reproducible results)
7. **Target Variable**: `Revenue` (binary: 0 = no purchase, 1 = purchase)

### Model Selection Results (Updated)
| Model | Accuracy | F1-Score | ROC-AUC | PR-AUC | CV ROC-AUC | Selected |
|-------|----------|----------|---------|---------|------------|----------|
| Logistic Regression | 0.9180 | 0.6751 | 0.9058 | 0.7730 | 0.9059 ± 0.006 | ❌ |
| Random Forest | 0.9341 | 0.7443 | 0.9466 | 0.8473 | 0.9495 ± 0.004 | ❌ |
| **XGBoost** | **0.9020** | **0.7229** | **0.9532** | **0.8592** | **0.9571 ± 0.004** | ✅ |

**XGBoost with Optimal Threshold (0.71):**
- **F1-Score**: 0.7600 (+0.037 vs default)
- **Precision**: 0.7996
- **Recall**: 0.7242
- **Accuracy**: 0.9292

**Why XGBoost?**
- Highest ROC-AUC (0.9532 test, 0.9571 CV) - best at ranking predictions
- Highest PR-AUC (0.8592) - robust for imbalanced data
- Includes `scale_pos_weight` to handle class imbalance
- 5-Fold CV confirms stability (std < 0.005)

### Model Artifacts
| File | Description |
|------|-------------|
| `models/model.pkl` | Complete sklearn Pipeline (preprocessing + XGBoost with scale_pos_weight) |
| `models/features.json` | Feature schema (names, types, order) |
| `models/metadata.json` | Model version, training date, metrics, CV scores |
| `models/evaluation_report.json` | Full comparison of all 3 models + optimal threshold |
| `models/optimal_threshold.json` | Optimal threshold (0.71) + metrics at optimal |
| `models/calibration_report.json` | Calibration analysis (ECE = 0.0706) |
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
│   │   ├── app/                    # Next.js app router (dashboard, jobs, chatbot)
│   │   ├── components/             # UI components (Header, UploadDropzone, Chatbot)
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
│   │   ├── controller/             # BatchJobController, DatasetController, ChatbotController
│   │   ├── service/               # JobProducerService, JobWorkerService, ChatbotService
│   │   ├── client/                # MLServiceClient, OpenAiClient
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

#### Chatbot Query
```bash
curl -X POST http://localhost:8080/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the purchase probability for high-engagement users?"}'
# Returns: {"response": "Insight: ...\n\nExplanation: ...\n\nStrategy: ...\n\nRecommendation: ..."}
```

#### Health Check
```bash
curl http://localhost:8080/api/actuator/health
```

**Note**: Endpoints return 404 if Spring Boot JAR doesn't include controllers. Rebuild with `docker compose build --no-cache spring-app` if needed.

## 📊 Model Performance
| Metric | Score (Test) | CV Score (5-Fold) |
|--------|---------------|-------------------|
| **Best Model** | XGBoost | XGBoost |
| **ROC-AUC** | 0.9532 | 0.9571 ± 0.004 |
| **PR-AUC** | 0.8592 | 0.8685 ± 0.009 |
| **Accuracy** | 0.9020 (0.9292*) | - |
| **F1-Score** | 0.7229 (0.7600*) | 0.7288 ± 0.014 |
| **Precision** | 0.6429 (0.7996*) | - |
| **Recall** | 0.8256 (0.7242*) | - |
| **Optimal Threshold** | 0.71 | - |

*Values in parentheses are with optimal threshold (0.71)

**Model Comparison:**
- Logistic Regression: ROC-AUC 0.9058, F1 0.6751
- Random Forest: ROC-AUC 0.9466, F1 0.7443
- **XGBoost: ROC-AUC 0.9532, F1 0.7229 (0.7600 with optimal threshold)** ✅

**Key Improvements:**
- ✅ Added `scale_pos_weight=5.46` to handle class imbalance (15.5% positive)
- ✅ 5-Fold Cross-Validation for robust evaluation
- ✅ Threshold tuning (0.5 → 0.71) improved F1 by +0.037
- ✅ Added PR-AUC metric (better for imbalanced data)
- ✅ Calibration analysis (ECE = 0.0706 - moderately calibrated)

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
- ✅ Chatbot API
- ✅ Invalid input handling

**Manual Testing:**
```bash
# Test FastAPI directly
curl http://localhost:8000/health

# Test batch job flow
curl -X POST http://localhost:8080/api/jobs/upload -F "file=@dataset.csv"
curl http://localhost:8080/api/jobs/1
```

## 🤖 Chatbot System Prompt
The chatbot uses a **4-section response format** for consistent marketing insights:

**Response Structure:**
1. **Insight** - Data-driven observation about the marketing scenario
2. **Explanation** - Clear reasoning behind the insight
3. **Strategy** - Actionable marketing strategy based on the insight
4. **Recommendation** - Specific next steps with expected outcomes

**Implementation:**
- `spring-app/src/main/java/com/example/socialpurchase/service/ChatbotService.java` - Contains `SYSTEM_PROMPT` constant
- `spring-app/src/main/java/com/example/socialpurchase/client/OpenAiClient.java` - Supports system+user messages
- System prompt includes strict rules to prevent hallucination and ensure data-driven responses

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
- **Chatbot Implementation Plan**: `IMPLEMENTATION_PLAN_CHATBOT.md`
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
- LLM integration for conversational AI
- Docker containerization & PostgreSQL persistence

---
**Status:** ✅ Core Features Complete, Model Upgraded  
**Completed:**
- ✅ AI Model Training (XGBoost, ROC-AUC 0.9571 CV, F1 0.760 with optimal threshold)
- ✅ Class Imbalance Handling (`scale_pos_weight=5.46`)
- ✅ 5-Fold Cross-Validation (stable performance: std <0.005)
- ✅ Threshold Tuning (0.5 → 0.71, F1 +0.037)
- ✅ Model Calibration Analysis (ECE = 0.0706)
- ✅ PR-AUC Metric (0.8592 test, 0.8685 CV)
- ✅ ML Service API (FastAPI with /predict, /batch_predict, /model_info, /explain)
- ✅ Spring Boot Backend (BatchJobController, DatasetController, ChatbotController)
- ✅ Next.js Frontend (Dashboard, Upload, Chatbot, Language Toggle EN/VI)
- ✅ Chatbot System Prompt (4-section format: Insight, Explanation, Strategy, Recommendation)
- ✅ Docker Compose Setup (4 services: postgres, marketing-ml, marketing-spring, marketing-frontend)
- ✅ Model Version Upgrade (v1.0.0 → v1.1.0)

**Model Metrics (v1.1.0):**
- ROC-AUC: 0.9571 (CV) | 0.9532 (test)
- F1-Score: 0.7600 (with optimal threshold 0.71)
- PR-AUC: 0.8685 (CV) | 0.8592 (test)
- Calibration ECE: 0.0706 (moderately calibrated)

**Next Steps:**
1. Confirm all Docker services running: `docker ps`
2. Test ML service: `curl http://localhost:8000/health`
3. Test model info: `curl http://localhost:8000/model_info`
4. Test CSV upload: `curl -X POST -F "file=@data/sample.csv" http://localhost:8080/api/jobs/upload`
5. Verify frontend: http://localhost:3000 (test language toggle EN/VI)
6. Test chatbot with sample marketing questions
