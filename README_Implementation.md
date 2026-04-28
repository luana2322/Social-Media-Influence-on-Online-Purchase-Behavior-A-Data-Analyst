# AI Marketing Assistant SaaS - Production Implementation

## Architecture Overview
```
User → Spring Boot → PostgreSQL (Job Queue) → JobWorker → FastAPI (ML) → Results
```

## Key Features Implemented
1. **DB-Based Job Queue** (No Redis/Kafka)
   - `job_queue` table with `FOR UPDATE SKIP LOCKED`
   - Multi-instance safe with stale lock recovery
   - Retry mechanism (max 3 attempts)

2. **Streaming CSV Processing**
   - Chunk-based processing (1000 records/chunk)
   - No full dataset loaded into memory
   - Handles 10K → 1M+ records

3. **Optimized FastAPI**
   - Model loaded ONCE at startup (global variable)
   - Vectorized prediction with Pandas DataFrame
   - NumPy segmentation: High (>0.8), Medium (>0.4), Low

4. **Fault Tolerance**
   - Survives server restarts (jobs in DB)
   - No double-processing with row locking
   - Automatic retry on failure

5. **Model Versioning**
   - `model_version` stored with each prediction
   - Trackable results for audit

## Database Setup
```bash
psql -U postgres -c "CREATE DATABASE marketing_ai;"
psql -U postgres -d marketing_ai -f sql/schema.sql
```

## Running the System

### 1. Start PostgreSQL
```bash
# Ensure PostgreSQL is running on localhost:5432
# Update credentials in spring-app/src/main/resources/application.properties
```

### 2. Start FastAPI ML Service
```bash
cd ml-service
pip install fastapi uvicorn pandas numpy scikit-learn joblib
python main.py
# Runs on http://localhost:8000
```

### 3. Start Spring Boot
```bash
cd spring-app
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

## API Usage

### Upload Dataset for Batch Prediction
```bash
curl -X POST http://localhost:8080/api/jobs/upload \
  -F "file=@dataset.csv"
# Returns: {"jobId": 1, "status": "pending"}
```

### Check Job Status
```bash
curl http://localhost:8080/api/jobs/1
```

### Get Prediction Results
```bash
curl http://localhost:8080/api/jobs/1/results
```

### Single Prediction (Legacy)
```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -d '{"PageValues": 3.5, "BounceRates": 0.2, ...}'
```

## Scaling Notes
- **Horizontal Scaling**: Run multiple Spring Boot instances (safe with SKIP LOCKED)
- **FastAPI Scaling**: Run multiple FastAPI instances behind Nginx
- **Database**: Add read replicas for query scaling
- **Future**: Replace DB queue with Kafka for 100x throughput

## File Structure
```
spring-app/
├── src/main/java/com/example/socialpurchase/
│   ├── entity/          # JPA Entities (JobQueue, PredictionJob, PredictionResult)
│   ├── repository/      # JPA Repositories
│   ├── service/         # Business Logic (JobWorker, DatasetStreaming, MLBatch)
│   ├── controller/      # REST Controllers
│   ├── client/         # FastAPI Client
│   └── dto/            # Request/Response DTOs
├── src/main/resources/
│   └── application.properties
└── pom.xml

ml-service/
└── main.py              # FastAPI with optimized batch prediction

sql/
└── schema.sql           # Database schema
```

## Performance Characteristics
- **Memory**: Constant (~chunk size), not proportional to dataset
- **Throughput**: ~1000 records/second per worker (configurable)
- **Scalability**: Linear with worker count (up to DB connection limit)
- **Reliability**: Survives crashes, no job loss
