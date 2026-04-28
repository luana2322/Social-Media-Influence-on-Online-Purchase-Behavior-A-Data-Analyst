# Implement Plan: AI Social Media Influence & Online Purchase Prediction System

## 🎯 Objective
Build a production-ready system that:
- Uses **only processed data** from `output/` directory
- Trains ML models on `output/final_fused_dataset.csv`
- Serves predictions via **FastAPI Python ML Service** + **Spring Boot Backend**
- Is modular, testable, and Docker-ready

## 🔒 Key Constraints
1. **Data Restrictions**:
   - ✅ Use only: `output/final_fused_dataset.csv`, `output/data_fusion.db`, `output/*.png`
   - ❌ DO NOT use `dataraw/`, external APIs, or raw data
2. **Scope Restrictions**:
   - ❌ DO NOT rebuild data pipelines or ETL processes
   - ✅ Focus strictly on: `Model Training → Model Serving → API Integration`
3. **Production Requirements**:
   - Clean, modular code
   - Reproducible model training
   - Containerized services (Docker)

## 📁 Data Source (Verified)
All data loaded exclusively from `output/`:
| File | Purpose |
|------|---------|
| `output/final_fused_dataset.csv` | Main ML dataset (features + target `purchase`) |
| `output/data_fusion.db` | Optional relational data (Spring Boot integration) |
| `output/*.png` | Existing analysis charts (reference only) |

### Dataset Details
- **Target**: `purchase` (binary 0/1)
- **Key Features**:
  - Numerical: `sentiment_score`, `engagement_rate`, `page_values`, `price`
  - Categorical: `product_category`, `user_behavior`
  - Reference: `revenue`

## 🧠 Machine Learning Spec
- **Problem Type**: Binary Classification
- **Models to Train**:
  1. Logistic Regression
  2. Random Forest
  3. XGBoost
- **Evaluation Metrics**: Accuracy, F1-Score, ROC-AUC
- **Model Artifacts** (save to `models/`):
  - `model.pkl`: Best trained model (**sklearn Pipeline** bundling preprocessing + model)
  - `features.json`: Feature schema (names, types, order)
  - `metadata.json`: Model versioning (model type, metrics, training date, dataset version)

### ML Pipeline Requirements
- Use **sklearn Pipeline** to bundle preprocessing + model (no separate scaler/encoder files)
- Save only `model.pkl` containing the entire Pipeline
- Save feature schema to `models/features.json`:
  ```json
  {
    "numerical_features": ["sentiment_score", "engagement_rate", "page_values", "price"],
    "categorical_features": ["product_category", "user_behavior"],
    "target": "purchase"
  }
  ```
- Save model metadata to `models/metadata.json`:
  ```json
  {
    "model_type": "XGBoost",
    "version": "1.0.0",
    "training_date": "2026-04-28",
    "metrics": {"accuracy": 0.95, "f1": 0.88, "roc_auc": 0.956},
    "dataset_version": "final_fused_dataset_v1"
  }
  ```

## 🤖 Service Architecture
### 1. FastAPI ML Service (Python)
- Loads models from `models/` on startup
- **Endpoints**:
  - `POST /predict`: Main prediction endpoint
  - `GET /health`: Health check (returns model status, feature schema)
  - `GET /metadata`: Return model metadata (version, metrics)
- **Input Validation**: Strict Pydantic schemas with type checking
- **Logging**: Structured logging (request ID, latency, prediction results)
- **Error Handling**: Graceful failures with informative error messages

### 2. Spring Boot Backend (Java)
- Exposes public REST API
- Calls FastAPI ML Service internally with **timeout + retry logic**
- **Logging**: Structured logging (SLF4J + Logback)
- Optional: Reads from `output/data_fusion.db`
- **Package Structure**:
  ```
  com.example.socialpurchase
  ├── controller/      # REST endpoints (with DTO validation)
  ├── service/        # Business logic
  ├── repository/     # DB access (optional)
  ├── entity/         # DB entities (optional)
  ├── dto/            # Request/Response DTOs (with validation annotations)
  └── client/         # FastAPI ML service client (with timeout + retry)
  ```

## 📦 DevOps Spec
- Dockerize both services
- `docker-compose.yml` orchestrates:
  - `ml-service`: FastAPI (port 8000)
  - `spring-app`: Spring Boot (port 8080)

## 📦 DevOps Spec
- Dockerize both services
- `docker-compose.yml` orchestrates:
  - `ml-service`: FastAPI (port 8000)
  - `spring-app`: Spring Boot (port 8080)

## 📌 Deliverables Checklist
### Core Deliverables
1. ✅ Project folder structure (with models/, ml-service/, spring-app/)
2. ✅ `scripts/train_model.py` (uses `final_fused_dataset.csv`)
3. ✅ FastAPI ML service code (main.py with all endpoints)
4. ✅ Spring Boot sample code (all packages with production features)
5. ✅ Example request/response
6. ✅ End-to-end system flow diagram
7. ✅ Dockerfiles + `docker-compose.yml`
8. ✅ Test suite (unit + integration)

### Production Enhancements ✨
9. ✅ **sklearn Pipeline** (preprocessing + model bundled in single model.pkl)
10. ✅ **features.json** (feature schema with names, types, order)
11. ✅ **metadata.json** (model versioning: type, metrics, date, dataset version)
12. ✅ **FastAPI /health endpoint** (health check with model status)
13. ✅ **FastAPI /metadata endpoint** (model metadata exposure)
14. ✅ **Strict input validation** (Pydantic schemas + Spring Boot DTO annotations)
15. ✅ **Structured logging** (Python logging module + SLF4J/Logback)
16. ✅ **Timeout + retry logic** in Spring Boot ML client (WebClient/RestTemplate)
17. ✅ **Graceful error handling** in both services (informative error messages)

---

## 🗓️ Implementation Phases

### Phase 1: Setup & Data Validation (Week 1)
**Tasks**:
1.1 Create project folder structure (see Section 4)
1.2 Verify `output/` files exist and are valid
1.3 Set up Python environment:
   - Create `requirements.txt` with: `pandas`, `scikit-learn`, `xgboost`, `fastapi`, `uvicorn`, `joblib`, `pydantic`
1.4 Set up Spring Boot environment (JDK 17+, Spring Boot 3.x)
1.5 Validate `final_fused_dataset.csv`:
   - Check `purchase` target distribution
   - Identify numerical vs categorical features

**Deliverables**: Folder structure, validated dataset, `requirements.txt`

---

### Phase 2: ML Model Training (Week 2)
**Tasks**:
2.1 Create `scripts/train_model.py`:
   - Load `output/final_fused_dataset.csv`
   - Split train/test (80/20, stratify by `purchase`)
   - Build **sklearn Pipeline** bundling preprocessing + model (no separate scaler/encoder)
   - Train 3 models (Logistic Regression, Random Forest, XGBoost) using Pipeline
   - Evaluate all models (Accuracy, F1, ROC-AUC)
   - Select best model → save `models/model.pkl` (entire Pipeline)
   - Save **feature schema** to `models/features.json` (feature names, types, order)
   - Save **model metadata** to `models/metadata.json` (model type, metrics, training date, dataset version)
2.2 Generate model evaluation report

**Dependencies**: Phase 1 complete
**Deliverables**: `scripts/train_model.py`, `models/` directory (model.pkl, features.json, metadata.json), evaluation report

---

### Phase 3: FastAPI ML Service (Week 3)
**Tasks**:
3.1 Create `ml-service/` directory
3.2 Implement `ml-service/main.py`:
   - Load Pipeline model + metadata on startup (from `models/`)
   - Define **strict Pydantic input schema** with type validation
   - **Endpoints**:
     - `POST /predict`: Main prediction (load features.json for schema validation)
     - `GET /health`: Health check (model loaded status, feature count)
     - `GET /metadata`: Return model metadata from metadata.json
   - **Logging**: Structured logging with Python `logging` module (request ID, timestamp, latency, prediction results)
   - **Error Handling**: Graceful failures with HTTP status codes + error messages
3.3 Add `ml-service/requirements.txt` with all dependencies
3.4 Test endpoint with sample requests (valid + invalid inputs)

**Dependencies**: Phase 2 complete
**Deliverables**: `ml-service/` code (main.py, requirements.txt), working endpoints with logging

---

### Phase 4: Spring Boot Backend (Week 4)
**Tasks**:
4.1 Initialize Spring Boot project (Maven/Gradle, Java 17+, Spring Boot 3.x)
4.2 Implement all packages:
   - `controller/PredictionController.java`: `POST /predict` with DTO validation (`@Valid`)
   - `service/PredictionService.java`: Business logic
   - `client/MLServiceClient.java`: 
     - Use `WebClient` or `RestTemplate` with **timeout configuration** (connect + read timeout)
     - Implement **retry logic** (exponential backoff, max 3 retries)
     - Handle FastAPI service downtime gracefully
   - `dto/PredictionRequest.java`, `PredictionResponse.java`: 
     - Add **validation annotations** (`@NotNull`, `@DecimalMin`, `@Size`, etc.)
   - Optional: `repository/`, `entity/` for `data_fusion.db`
4.3 Configure **SLF4J + Logback** for structured logging:
   - Log incoming requests, outgoing API calls, predictions, errors
   - Include timestamps, request IDs, latency
4.4 Test endpoint locally (valid/invalid inputs, timeout scenarios)

**Dependencies**: Phase 3 complete
**Deliverables**: Spring Boot application with timeout+retry, logging, DTO validation, working `/predict` endpoint

---

### Phase 5: Dockerization & Orchestration (Week 5)
**Tasks**:
5.1 Create `ml-service/Dockerfile` (Python base)
5.2 Create `spring-app/Dockerfile` (JDK base)
5.3 Create `docker-compose.yml`:
   - Define `ml-service` (port 8000)
   - Define `spring-app` (port 8080)
   - Network configuration for service-to-service communication
5.4 Verify `docker-compose up` works end-to-end

**Dependencies**: Phase 4 complete
**Deliverables**: Dockerfiles, `docker-compose.yml`, containerized services

---

### Phase 6: Testing & Validation (Week 6)
**Tasks**:
6.1 ML Service tests:
   - Unit test model loading and prediction (Pipeline only)
   - Integration test all endpoints: `/predict`, `/health`, `/metadata`
   - Test **input validation** (invalid types, missing fields, out-of-range values)
   - Test **logging** (verify structured logs are generated)
6.2 Spring Boot tests:
   - Unit test service and client
   - Integration test `/predict` endpoint with DTO validation
   - Test **timeout + retry logic** (simulate ML service downtime)
   - Test **logging** (verify SLF4J logs are generated)
6.3 End-to-end test:
   - Send request to Spring Boot → verify ML service call → validate response
   - Test with `features.json` schema validation
6.4 Performance test:
   - ML service response <200ms
   - Spring Boot → ML service round-trip <500ms

**Dependencies**: Phase 5 complete
**Deliverables**: Test suite (unit + integration), test report, performance benchmarks

---

### Phase 7: Documentation & Delivery (Week 7)
**Tasks**:
7.1 Create `README.md` with:
   - Setup instructions (local, Docker)
   - API docs (Spring Boot, FastAPI)
   - Example requests/responses
7.2 Document end-to-end system flow
7.3 Package all deliverables

**Dependencies**: Phase 6 complete
**Deliverables**: Full documentation, final deliverable package

---

## 📂 Folder Structure
```
AI-Social-Purchase-Prediction/
├── output/                          # Processed data (DO NOT MODIFY)
│   ├── final_fused_dataset.csv
│   ├── data_fusion.db
│   └── *.png
├── models/                          # Trained model artifacts
│   ├── model.pkl                    # sklearn Pipeline (preprocessing + model bundled)
│   ├── features.json                # Feature schema (names, types, order)
│   └── metadata.json                # Model versioning info
├── scripts/                         # Training scripts
│   └── train_model.py
├── ml-service/                      # FastAPI ML service
│   ├── main.py                      # Endpoints: /predict, /health, /metadata
│   ├── requirements.txt
│   └── Dockerfile
├── spring-app/                      # Spring Boot backend
│   ├── src/main/java/com/example/socialpurchase/
│   │   ├── controller/              # With DTO validation
│   │   ├── service/
│   │   ├── repository/             # Optional DB access
│   │   ├── entity/
│   │   ├── dto/                    # With validation annotations
│   │   └── client/                 # With timeout + retry logic
│   ├── src/main/resources/
│   │   └── logback-spring.xml      # Logging configuration
│   ├── pom.xml / build.gradle
│   └── Dockerfile
├── docker-compose.yml               # Orchestrates Spring Boot + ML Service
├── requirements.txt                 # Python dependencies (root level)
├── IMPLEMENT_PLAN.md
└── README.md
```

---

## 💻 Example Request/Response
### Spring Boot Endpoint
`POST http://localhost:8080/predict`

**Request Body**:
```json
{
  "sentiment_score": 0.7,
  "engagement_rate": 0.6,
  "page_values": 50,
  "price": 120,
  "product_category": "Electronics",
  "user_behavior": "Browser"
}
```

**Response**:
```json
{
  "purchase_probability": 0.85,
  "model_version": "xgboost_v1"
}
```

### FastAPI ML Service Endpoint
`POST http://localhost:8000/predict`

**Request Body**: Same as above
**Response**: Same as above

---

## 🔄 End-to-End System Flow
```
1. Client sends POST /predict to Spring Boot (port 8080)
2. Spring Boot validates request (DTO validation), maps to DTO
3. Spring Boot's MLServiceClient calls FastAPI /predict (port 8000) with timeout+retry
4. FastAPI validates input (Pydantic), loads Pipeline model from model.pkl
5. FastAPI runs prediction (Pipeline handles preprocessing + prediction)
6. FastAPI returns purchase_probability with logging
7. Spring Boot receives response, maps to DTO with logging
8. Spring Boot returns response to client
```

---

## 🚀 Milestones
| Week | Milestone |
|------|-----------|
| 1 | Phase 1 complete (Setup & Validation) |
| 2 | Phase 2 complete (ML Training) |
| 3 | Phase 3 complete (FastAPI Service) |
| 4 | Phase 4 complete (Spring Boot) |
| 5 | Phase 5 complete (Docker) |
| 6 | Phase 6 complete (Testing) |
| 7 | Phase 7 complete (Delivery) |
