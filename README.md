# AI Social Media Influence & Online Purchase Prediction System

## 🎯 Overview
A production-ready AI system that predicts online purchase behavior by analyzing social media influence. The system uses machine learning models trained on fused data (e-commerce + social media + product data) and serves predictions via a FastAPI ML service with Spring Boot as the backend API layer.

## 🏗️ Architecture
```
Client → Spring Boot (port 8080) → FastAPI ML Service (port 8000) → XGBoost Model (model.pkl)
                ↓
                                    sklearn Pipeline (preprocessing + prediction)
```

**Data Flow:**
`output/final_fused_dataset.csv` → `scripts/train_model.py` → `models/model.pkl` (Pipeline)

## ✨ Features
- **Binary Classification**: Predict purchase probability (0-1)
- **sklearn Pipeline**: Bundles preprocessing + XGBoost model (no separate scaler/encoder)
- **FastAPI Endpoints**: `/predict`, `/health`, `/metadata`
- **Spring Boot Backend**: REST API with timeout + retry logic
- **Input Validation**: Pydantic (FastAPI) + Jakarta Validation (Spring Boot)
- **Structured Logging**: Python logging module + SLF4J/Logback
- **Dockerized**: Multi-container setup with docker-compose
- **Model Metadata**: Version tracking via `metadata.json`

## 🛠️ Tech Stack
| Component | Technology |
|-----------|-------------|
| ML Training | Python 3.9+, scikit-learn, XGBoost, pandas |
| ML Serving | FastAPI, uvicorn, joblib |
| Backend API | Spring Boot 3.2, Java 17, Maven |
| HTTP Client | WebClient with reactive retry pattern |
| Containerization | Docker, docker-compose |
| Data Source | Processed CSV (50K samples, 17 features) |

## 📂 Project Structure
```
AI-Social-Purchase-Prediction/
├── output/                          # Processed data (DO NOT MODIFY)
│   ├── final_fused_dataset.csv      # Main ML dataset (50K rows, 42 cols)
│   ├── data_fusion.db               # SQLite database (optional)
│   └── *.png                       # Analysis charts
├── models/                          # Trained model artifacts
│   ├── model.pkl                    # sklearn Pipeline (preprocessing + XGBoost)
│   ├── features.json                # Feature schema (names, types, order)
│   ├── metadata.json                # Model versioning info
│   └── evaluation_report.json      # Performance metrics
├── scripts/                         # Training scripts
│   ├── train_model.py              # Model training script
│   └── test_endpoints.sh           # API testing script
├── ml-service/                      # FastAPI ML service
│   ├── main.py                     # Endpoints: /predict, /health, /metadata
│   ├── requirements.txt
│   └── Dockerfile
├── spring-app/                      # Spring Boot backend
│   ├── src/main/java/com/example/socialpurchase/
│   │   ├── controller/              # PredictionController.java
│   │   ├── service/                # PredictionService.java
│   │   ├── client/                 # MLServiceClient.java (timeout+retry)
│   │   └── dto/                    # PredictionRequest.java, PredictionResponse.java
│   ├── pom.xml
│   └── Dockerfile
├── docker-compose.yml               # Orchestrates both services
├── requirements.txt                 # Python dependencies (root)
├── IMPLEMENT_PLAN.md               # Detailed implementation plan
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Java 17+
- Maven 3.9+
- Docker & docker-compose (optional)

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
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**3. Start Spring Boot Backend (Terminal 2):**
```bash
cd spring-app
mvn spring-boot:run
```

### Docker Setup
```bash
docker-compose up --build
```
This starts:
- ML Service at `http://localhost:8000`
- Spring Boot at `http://localhost:8080`

## 📡 API Documentation

### FastAPI ML Service (Port 8000)

#### Health Check
```bash
curl http://localhost:8000/health
```
Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "features_count": 17,
  "model_type": "XGBoost"
}
```

#### Model Metadata
```bash
curl http://localhost:8000/metadata
```
Response:
```json
{
  "model_type": "XGBoost",
  "version": "1.0.0",
  "training_date": "2026-04-28",
  "metrics": {
    "accuracy": 0.9332,
    "f1": 0.7555,
    "roc_auc": 0.9539
  },
  "dataset_version": "final_fused_dataset_v1",
  "features_count": 17
}
```

#### Prediction
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
Response:
```json
{
  "purchase_probability": 0.9999,
  "model_version": "1.0.0",
  "model_type": "XGBoost"
}
```

### Spring Boot (Port 8080)

#### Prediction (Proxy to ML Service)
```bash
curl -X POST http://localhost:8080/predict \
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

#### Health Check
```bash
curl http://localhost:8080/predict/health
```

## 📊 Model Performance
| Metric | Score |
|--------|------|
| **Best Model** | XGBoost |
| **ROC-AUC** | 0.9539 |
| **Accuracy** | 0.9332 |
| **F1-Score** | 0.7555 |

**Model Comparison:**
- Logistic Regression: ROC-AUC 0.9058
- Random Forest: ROC-AUC 0.9466
- **XGBoost: ROC-AUC 0.9539** ✅

See `models/evaluation_report.json` for full details.

## 📁 Data Source
**⚠️ Important:** This project uses **ONLY processed data** from the `output/` directory.

| File | Purpose |
|------|---------|
| `output/final_fused_dataset.csv` | Main ML dataset (50,000 samples, 42 features) |
| `output/data_fusion.db` | SQLite database (optional Spring Boot integration) |
| `output/*.png` | Existing analysis charts |

**Target Variable:** `Revenue` (binary: 0 = no purchase, 1 = purchase)

**Key Features (17 used):**
- Numerical: PageValues, BounceRates, ExitRates, ProductRelated, Administrative, avg_sentiment, total_engagement, positive_ratio, engagement_norm, global_avg_price
- Categorical: Month, OperatingSystems, Browser, Region, TrafficType, VisitorType, Weekend

## 🧪 Testing
Run the test script to verify all endpoints:
```bash
bash scripts/test_endpoints.sh
```

**Test Coverage:**
- ✅ ML Service health check
- ✅ ML Service metadata endpoint
- ✅ Valid prediction request
- ✅ Invalid input handling (missing fields)

**Manual Testing:**
```bash
# Test FastAPI directly
curl http://localhost:8000/health

# Test Spring Boot → FastAPI flow
curl -X POST http://localhost:8080/predict -H "Content-Type: application/json" -d @sample_request.json
```

## 📖 References
- **Implementation Plan**: `IMPLEMENT_PLAN.md` (detailed 7-phase plan)
- **Model Schema**: `models/features.json`
- **Model Metadata**: `models/metadata.json`
- **Training Script**: `scripts/train_model.py`

## 📝 Notes
- Model is saved as a **sklearn Pipeline** (no separate scaler/encoder files)
- Spring Boot uses **WebClient** with exponential backoff retry (max 3 attempts)
- All input validation uses strict type checking (Pydantic + Jakarta Validation)
- No Redis caching (removed per requirements)
- No separate scaler/encoder artifacts (bundled in Pipeline)

## 🎓 Academic Context
This project was built as part of a data science/ML course, demonstrating:
- Data fusion techniques (e-commerce + social media + product data)
- Production-ready ML system design
- Microservices architecture (Python ML + Java Backend)
- Docker containerization

---

**Status:** ✅ Phase 1-3 Complete (Model Training, FastAPI Service, Spring Boot Structure)  
**Next Steps:** Complete Spring Boot integration testing, finalize Docker deployment
