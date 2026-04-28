# Quick Start Guide

## Prerequisites
- Docker & Docker Compose
- Java 17 (for local development)
- Python 3.10+ (for local ML service development)

## Run with Docker (Recommended)

1. Start all services:
```bash
docker-compose up -d
```

2. Check services are running:
```bash
docker-compose ps
```

3. Access:
   - Spring Boot API: http://localhost:8080/api
   - ML Service: http://localhost:8000
   - PostgreSQL: localhost:5432

4. Run database schema:
```bash
docker exec -i marketing-postgres psql -U postgres marketing_ai < sql/schema.sql
```

## API Usage

### Upload Dataset & Start Batch Prediction
```bash
curl -X POST http://localhost:8080/api/jobs/upload -F "file=@your_dataset.csv"
# Returns: {"jobId": 1, "status": "pending"}
```

### Check Job Status
```bash
curl http://localhost:8080/api/jobs/1
```

### Get Results
```bash
curl http://localhost:8080/api/jobs/1/results
```

### Chatbot Query
```bash
curl -X POST http://localhost:8080/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Which users should we target?", "jobId": 1}'
```

### Single Prediction
```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -d '{"PageValues": 3.5, "BounceRates": 0.2, ...}'
```

## Local Development

### ML Service (FastAPI)
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

### Spring Boot
```bash
cd spring-app
mvn spring-boot:run
```

## Stop Services
```bash
docker-compose down
```

## View Logs
```bash
docker-compose logs -f spring-app
docker-compose logs -f ml-service
```
