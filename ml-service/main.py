from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import joblib
import json
import pandas as pd
import numpy as np
from typing import Dict, Any
import logging
import uuid
from datetime import datetime
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Social Media Purchase Prediction API")

# Global variables for loaded models (loaded ONCE at startup)
model = None
features_schema = None
metadata = None
optimal_threshold = None
MODEL_VERSION = "v1.0.0"

class BatchRecord(BaseModel):
    recordId: str
    features: Dict[str, Any]

class BatchPredictRequest(BaseModel):
    records: List[BatchRecord]

class BatchPredictResponse(BaseModel):
    recordId: str
    probability: float
    segment: str
    modelVersion: str

class SinglePredictionRequest(BaseModel):
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

class SinglePredictionResponse(BaseModel):
    purchase_probability: float
    model_version: str
    model_type: str

@app.on_event("startup")
async def load_model():
    global model, features_schema, metadata, MODEL_VERSION, optimal_threshold
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'models', 'model.pkl')
        features_path = os.path.join(base_dir, 'models', 'features.json')
        metadata_path = os.path.join(base_dir, 'models', 'metadata.json')
        threshold_path = os.path.join(base_dir, 'models', 'optimal_threshold.json')

        model = joblib.load(model_path)
        with open(features_path, 'r') as f:
            features_schema = json.load(f)
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        try:
            with open(threshold_path, 'r') as f:
                threshold_data = json.load(f)
                optimal_threshold = threshold_data.get('optimal_threshold', 0.5)
        except FileNotFoundError:
            optimal_threshold = 0.5
        MODEL_VERSION = metadata.get('version', 'v1.0.0')
        logger.info(f"Model loaded successfully. Version: {MODEL_VERSION}, Optimal threshold: {optimal_threshold}")
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "features_count": len(features_schema['all_features']) if features_schema else 0,
        "model_type": metadata.get('model_type', 'unknown') if metadata else 'unknown',
        "model_version": MODEL_VERSION
    }

@app.get("/metadata")
async def get_metadata():
    if metadata is None:
        raise HTTPException(status_code=503, detail="Model metadata not loaded")
    return metadata

@app.get("/model_info")
async def get_model_info():
    """Get comprehensive model info including calibration and threshold"""
    if metadata is None:
        raise HTTPException(status_code=503, detail="Model metadata not loaded")
    
    info = {
        "model_type": metadata.get('model_type'),
        "version": MODEL_VERSION,
        "optimal_threshold": optimal_threshold,
        "calibration": None
    }
    
    # Load calibration report if exists
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        calibration_path = os.path.join(base_dir, 'models', 'calibration_report.json')
        with open(calibration_path, 'r') as f:
            info["calibration"] = json.load(f)
    except:
        pass
    
    return info

@app.post("/predict", response_model=SinglePredictionResponse)
async def predict(request: SinglePredictionRequest):
    request_id = str(uuid.uuid4())[:8]

    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        data = request.dict()
        df = pd.DataFrame([data])
        feature_order = features_schema['all_features']
        df = df[feature_order]

        probability = model.predict_proba(df)[0][1]

        logger.info(f"{request_id} - Prediction: {probability:.4f}")

        return SinglePredictionResponse(
            purchase_probability=float(probability),
            model_version=MODEL_VERSION,
            model_type=metadata.get('model_type', 'XGBoost')
        )
    except Exception as e:
        logger.error(f"{request_id} - Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/batch_predict_chunk", response_model=List[BatchPredictResponse])
async def batch_predict_chunk(records: List[BatchRecord]):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    if not records:
        return []

    try:
        features_list = [r.features for r in records]
        df = pd.DataFrame(features_list)

        if features_schema and 'all_features' in features_schema:
            df = df[features_schema['all_features']]

        probabilities = model.predict_proba(df)[:, 1]

        segments = np.where(probabilities > 0.8, "High",
                   np.where(probabilities > optimal_threshold, "Medium", "Low"))

        results = [
            BatchPredictResponse(
                recordId=records[i].recordId,
                probability=float(probabilities[i]),
                segment=segments[i],
                modelVersion=MODEL_VERSION
            )
            for i in range(len(records))
        ]

        logger.info(f"Batch predicted {len(records)} records")
        return results
    except Exception as e:
        logger.error(f"Batch predict error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.post("/segment")
async def segment_predictions(probabilities: List[float]):
    """Get segmentation labels for a list of probabilities using optimal threshold"""
    segments = []
    for prob in probabilities:
        if prob > 0.8:
            segments.append("High")
        elif prob > optimal_threshold:
            segments.append("Medium")
        else:
            segments.append("Low")
    return {"segments": segments, "threshold_used": optimal_threshold}

@app.get("/explain")
async def explain_prediction(user_id: str, PageValues: float, BounceRates: float,
                            ExitRates: float, ProductRelated: float, Administrative: float,
                            avg_sentiment: float, total_engagement: float, positive_ratio: float,
                            engagement_norm: float, global_avg_price: float, Month: str,
                            OperatingSystems: int, Browser: int, Region: int,
                            TrafficType: int, VisitorType: str, Weekend: int):
    """Get SHAP explanation for a SINGLE prediction (on-demand)"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        features = {
            "PageValues": PageValues, "BounceRates": BounceRates, "ExitRates": ExitRates,
            "ProductRelated": ProductRelated, "Administrative": Administrative,
            "avg_sentiment": avg_sentiment, "total_engagement": total_engagement,
            "positive_ratio": positive_ratio, "engagement_norm": engagement_norm,
            "global_avg_price": global_avg_price, "Month": Month,
            "OperatingSystems": OperatingSystems, "Browser": Browser, "Region": Region,
            "TrafficType": TrafficType, "VisitorType": VisitorType, "Weekend": Weekend
        }

        df = pd.DataFrame([features])
        if features_schema and 'all_features' in features_schema:
            df = df[features_schema['all_features']]

        probability = float(model.predict_proba(df)[0][1])

        try:
            import shap
            explainer = shap.TreeExplainer(model.named_steps['classifier'])
            preprocessed = model.named_steps['preprocessor'].transform(df)
            shap_values = explainer.shap_values(preprocessed)

            if isinstance(shap_values, list):
                shap_vals = shap_values[1][0]
            else:
                shap_vals = shap_values[0]

            feature_cols = features_schema['all_features'] if features_schema else list(features.keys())
            feature_importance = list(zip(feature_cols, shap_vals))
            feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)

            return {
                "user_id": user_id,
                "probability": probability,
                "top_features": [{"feature": f[0], "impact": float(f[1])} for f in feature_importance[:5]],
                "explanation": f"Prediction driven by: {feature_importance[0][0]}"
            }
        except ImportError:
            return {
                "user_id": user_id,
                "probability": probability,
                "top_features": [],
                "explanation": "SHAP not available. Install with: pip install shap"
            }
        except Exception as shap_error:
            return {
                "user_id": user_id,
                "probability": probability,
                "top_features": [],
                "explanation": f"SHAP explanation unavailable: {str(shap_error)}"
            }

    except Exception as e:
        logger.error(f"Explain error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
