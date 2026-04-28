#!/bin/bash

echo "=== Phase6: Testing & Validation ==="
echo ""

# Test 1: ML Service Health Check
echo "Test 1: ML Service Health Check"
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""

# Test 2: ML Service Metadata
echo "Test 2: ML Service Metadata"
curl -s http://localhost:8000/metadata | python3 -m json.tool
echo ""

# Test 3: ML Service Prediction
echo "Test 3: ML Service Prediction"
curl -s -X POST http://localhost:8000/predict \
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
  }' | python3 -m json.tool
echo ""

# Test 4: ML Service Invalid Input
echo "Test 4: ML Service Invalid Input (missing field)"
curl -s -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"PageValues": 50.0}' | python3 -m json.tool
echo ""

echo "=== ML Service Tests Complete ==="
echo ""
echo "NOTE: Spring Boot service needs to be built and started on port 8080"
echo "To test Spring Boot endpoints:"
echo "  1. cd spring-app && mvn spring-boot:run"
echo "  2. Run: curl -X POST http://localhost:8080/predict -H 'Content-Type: application/json' -d '{...}'"
