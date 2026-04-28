from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import json
import pandas as pd
from typing import Dict, Any
import logging
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Social Media Purchase Prediction API")

# Global variables for loaded models
model = None
features_schema = None
metadata = None

class PredictionRequest(BaseModel):
    PageValues: float = Field(..., ge=0, description="Page values")
    BounceRates: float = Field(..., ge=0, le=1, description="Bounce rates")
    ExitRates: float = Field(..., ge=0, le=1, description="Exit rates")
    ProductRelated: float = Field(..., ge=0, description="Product related pages")
    Administrative: float = Field(..., ge=0, description="Administrative pages")
    avg_sentiment: float = Field(..., ge=-1, le=1, description="Average sentiment score")
    total_engagement: float = Field(..., ge=0, description="Total engagement")
    positive_ratio: float = Field(..., ge=0, le=1, description="Positive sentiment ratio")
    engagement_norm: float = Field(..., ge=0, le=1, description="Normalized engagement")
    global_avg_price: float = Field(..., ge=0, description="Global average price")
    Month: str = Field(..., description="Month")
    OperatingSystems: int = Field(..., ge=1, le=3, description="Operating system")
    Browser: int = Field(..., ge=1, le=13, description="Browser type")
    Region: int = Field(..., ge=1, le=9, description="Region")
    TrafficType: int = Field(..., ge=1, le=20, description="Traffic type")
    VisitorType: str = Field(..., description="Visitor type")
    Weekend: int = Field(..., ge=0, le=1, description="Weekend (0 or 1)")

class PredictionResponse(BaseModel):
    purchase_probability: float
    model_version: str
    model_type: str

@app.on_event("startup")
async def load_model():
    global model, features_schema, metadata
    try:
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, 'models', 'model.pkl')
        features_path = os.path.join(base_dir, 'models', 'features.json')
        metadata_path = os.path.join(base_dir, 'models', 'metadata.json')
        
        model = joblib.load(model_path)
        with open(features_path, 'r') as f:
            features_schema = json.load(f)
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        logger.info("Model and schemas loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "features_count": len(features_schema['all_features']) if features_schema else 0,
        "model_type": metadata.get('model_type', 'unknown') if metadata else 'unknown'
    }

@app.get("/metadata")
async def get_metadata():
    if metadata is None:
        raise HTTPException(status_code=503, detail="Model metadata not loaded")
    return metadata

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    request_id = str(uuid.uuid4())[:8]
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Create DataFrame from request
        data = request.dict()
        df = pd.DataFrame([data])
        
        # Ensure column order matches training
        feature_order = features_schema['all_features']
        df = df[feature_order]
        
        # Make prediction
        probability = model.predict_proba(df)[0][1]
        
        logger.info(f"{request_id} - Prediction: {probability:.4f}")
        
        return PredictionResponse(
            purchase_probability=float(probability),
            model_version=metadata.get('version', '1.0.0'),
            model_type=metadata.get('model_type', 'XGBoost')
        )
    except Exception as e:
        logger.error(f"{request_id} - Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
