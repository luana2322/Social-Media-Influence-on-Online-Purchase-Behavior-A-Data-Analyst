from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import joblib
import json
import pandas as pd
import numpy as np
import logging
import uuid
from datetime import datetime
import os

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Social Media Purchase Prediction API")

registry = {}
models_cache = {}
features_cache = {}
metadata_cache = {}
threshold_cache = {}
DEFAULT_VERSION = "1.0.0"

class BatchRecord(BaseModel):
    recordId: str
    features: Dict[str, Any]

class BatchPredictRequest(BaseModel):
    datasetType: str = "GENERAL"
    records: List[BatchRecord]

class BatchPredictResponse(BaseModel):
    recordId: str
    probability: float
    segment: str
    modelVersion: str

class SinglePredictionRequest(BaseModel):
    PageValues: float = Field(..., ge=0)
    BounceRates: float = Field(..., ge=0, le=1)
    ExitRates: float = Field(..., ge=0, le=1)
    ProductRelated: float = Field(..., ge=0)
    Administrative: float = Field(..., ge=0)
    avg_sentiment: float = Field(..., ge=-1, le=1)
    total_engagement: float = Field(..., ge=0)
    positive_ratio: float = Field(..., ge=0, le=1)
    engagement_norm: float = Field(..., ge=0, le=1)
    global_avg_price: float = Field(..., ge=0)
    Month: str = Field(..., description="Month")
    OperatingSystems: int = Field(..., ge=1, le=3)
    Browser: int = Field(..., ge=1, le=13)
    Region: int = Field(..., ge=1, le=9)
    TrafficType: int = Field(..., ge=1, le=20)
    VisitorType: str = Field(..., description="Visitor type")
    Weekend: int = Field(..., ge=0, le=1)

class SinglePredictionResponse(BaseModel):
    purchase_probability: float
    model_version: str
    model_type: str

def load_registry():
    global registry
    base_dir = os.path.dirname(os.path.abspath(__file__))
    registry_path = os.path.join(base_dir, 'models', 'registry.json')
    if os.path.exists(registry_path):
        with open(registry_path, 'r') as f:
            registry = json.load(f)
        logger.info(f"Loaded model registry with types: {list(registry.keys())}")
    else:
        registry = {}
        logger.warning("No registry.json found. Using single model mode.")

def load_model_for_type(dataset_type: str):
    global models_cache, features_cache, metadata_cache, threshold_cache

    if dataset_type in models_cache and models_cache[dataset_type] is not None:
        return

    if dataset_type not in registry:
        fallback_type = None
        for rt in registry:
            if registry[rt].get("fallback_to_default", False) and rt != dataset_type:
                fallback_type = rt
                break
        if fallback_type:
            logger.info(f"Type '{dataset_type}' not in registry, falling back to '{fallback_type}'")
            dataset_type = fallback_type
        else:
            logger.warning(f"Type '{dataset_type}' not in registry and no fallback. Using GENERAL.")
            dataset_type = "GENERAL"

    base_dir = os.path.dirname(os.path.abspath(__file__))
    entry = registry.get(dataset_type, {})
    if not entry:
        logger.error(f"No registry entry for '{dataset_type}'")
        return

    model_path = os.path.join(base_dir, entry.get("model_path", ""))
    features_path = os.path.join(base_dir, entry.get("features_path", ""))
    metadata_path = os.path.join(base_dir, entry.get("metadata_path", ""))
    threshold_path = os.path.join(base_dir, entry.get("threshold_path", ""))

    if not os.path.exists(model_path):
        logger.warning(f"Model file not found: {model_path}. '{dataset_type}' will fall back to GENERAL.")
        return

    try:
        models_cache[dataset_type] = joblib.load(model_path)
        logger.info(f"Loaded model for '{dataset_type}' from {model_path}")
        with open(features_path, 'r') as f:
            features_cache[dataset_type] = json.load(f)
        with open(metadata_path, 'r') as f:
            metadata_cache[dataset_type] = json.load(f)
        try:
            with open(threshold_path, 'r') as f:
                threshold_data = json.load(f)
                threshold_cache[dataset_type] = threshold_data.get('optimal_threshold', 0.5)
        except:
            threshold_cache[dataset_type] = 0.5
    except Exception as e:
        logger.error(f"Error loading model for '{dataset_type}': {e}")
        models_cache[dataset_type] = None

def get_or_load_model(dataset_type: str):
    if dataset_type in models_cache and models_cache[dataset_type] is not None:
        return models_cache[dataset_type]

    # Try loading the specific type model
    if dataset_type in registry:
        load_model_for_type(dataset_type)
        if dataset_type in models_cache and models_cache[dataset_type] is not None:
            return models_cache[dataset_type]

    # Fall back to GENERAL
    logger.info(f"'{dataset_type}' model unavailable, falling back to GENERAL")
    if "GENERAL" not in models_cache:
        load_model_for_type("GENERAL")
    return models_cache.get("GENERAL")

@app.on_event("startup")
async def startup():
    load_registry()
    for dtype in list(registry.keys()):
        load_model_for_type(dtype)
    logger.info(f"Model service ready. Loaded {len(models_cache)} models.")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": len(models_cache),
        "model_types": list(models_cache.keys()),
        "model_version": DEFAULT_VERSION
    }

@app.get("/metadata")
async def get_metadata(datasetType: str = "GENERAL"):
    if datasetType in metadata_cache:
        return metadata_cache[datasetType]
    raise HTTPException(status_code=503, detail=f"Metadata for '{datasetType}' not loaded")

@app.get("/model_info")
async def get_model_info(datasetType: str = "GENERAL"):
    meta = metadata_cache.get(datasetType)
    thresh = threshold_cache.get(datasetType, 0.5)
    if meta is None:
        raise HTTPException(status_code=503, detail=f"Model info for '{datasetType}' not loaded")
    return {
        "model_type": meta.get('model_type'),
        "version": meta.get('version', DEFAULT_VERSION),
        "optimal_threshold": thresh,
        "calibration": None
    }

@app.post("/predict", response_model=SinglePredictionResponse)
async def predict(request: SinglePredictionRequest, datasetType: str = "GENERAL"):
    request_id = str(uuid.uuid4())[:8]
    model = get_or_load_model(datasetType)
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model for '{datasetType}' not available")
    try:
        data = request.dict()
        df = pd.DataFrame([data])
        schema = features_cache.get(datasetType, {})
        feature_order = schema.get('all_features', list(data.keys()))
        df = df[feature_order]
        probability = model.predict_proba(df)[0][1]
        meta = metadata_cache.get(datasetType, {})
        logger.info(f"{request_id} - Prediction: {probability:.4f} (type: {datasetType})")
        return SinglePredictionResponse(
            purchase_probability=float(probability),
            model_version=meta.get('version', DEFAULT_VERSION),
            model_type=meta.get('model_type', 'XGBoost')
        )
    except Exception as e:
        logger.error(f"{request_id} - Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/batch_predict_chunk", response_model=List[BatchPredictResponse])
async def batch_predict_chunk(request: BatchPredictRequest):
    dataset_type = request.datasetType or "GENERAL"
    model = get_or_load_model(dataset_type)
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model for '{dataset_type}' not available")

    # Determine the actual model type being used (after fallback)
    actual_type = dataset_type
    if dataset_type not in features_cache or features_cache.get(dataset_type) is None:
        actual_type = "GENERAL"

    records = request.records
    if not records:
        return []

    try:
        features_list = [r.features for r in records]
        df = pd.DataFrame(features_list)

        schema = features_cache.get(actual_type, {})
        if schema and 'all_features' in schema:
            available = [c for c in schema['all_features'] if c in df.columns]
            df = df[available]

        probabilities = model.predict_proba(df)[:, 1]

        opt_threshold = threshold_cache.get(actual_type, 0.5)
        segments = np.where(probabilities > 0.8, "High",
                   np.where(probabilities > opt_threshold, "Medium", "Low"))

        meta = metadata_cache.get(actual_type, {})
        results = [
            BatchPredictResponse(
                recordId=records[i].recordId,
                probability=float(probabilities[i]),
                segment=segments[i],
                modelVersion=meta.get('version', DEFAULT_VERSION)
            )
            for i in range(len(records))
        ]

        logger.info(f"Batch predicted {len(records)} records (type: {dataset_type}, actual: {actual_type})")
        return results
    except Exception as e:
        logger.error(f"Batch predict error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.post("/segment")
async def segment_predictions(probabilities: List[float], datasetType: str = "GENERAL"):
    opt_threshold = threshold_cache.get(datasetType, 0.5)
    segments = []
    for prob in probabilities:
        if prob > 0.8:
            segments.append("High")
        elif prob > opt_threshold:
            segments.append("Medium")
        else:
            segments.append("Low")
    return {"segments": segments, "threshold_used": opt_threshold}

@app.get("/explain")
async def explain_prediction(
    user_id: str, datasetType: str = "GENERAL",
    PageValues: float = 0, BounceRates: float = 0,
    ExitRates: float = 0, ProductRelated: float = 0, Administrative: float = 0,
    avg_sentiment: float = 0, total_engagement: float = 0, positive_ratio: float = 0,
    engagement_norm: float = 0, global_avg_price: float = 0, Month: str = "Jan",
    OperatingSystems: int = 1, Browser: int = 1, Region: int = 1,
    TrafficType: int = 1, VisitorType: str = "Returning_Visitor", Weekend: int = 0):
    model = get_or_load_model(datasetType)
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model for '{datasetType}' not available")
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
        schema = features_cache.get(datasetType, {})
        if schema and 'all_features' in schema:
            df = df[schema['all_features']]

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
            feature_cols = schema.get('all_features', list(features.keys()))
            feature_importance = list(zip(feature_cols, shap_vals))
            feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)
            return {
                "user_id": user_id,
                "probability": probability,
                "dataset_type": datasetType,
                "top_features": [{"feature": f[0], "impact": float(f[1])} for f in feature_importance[:5]],
                "explanation": f"Prediction driven by: {feature_importance[0][0]}"
            }
        except ImportError:
            return {
                "user_id": user_id,
                "dataset_type": datasetType,
                "probability": probability,
                "top_features": [],
                "explanation": "SHAP not available. Install with: pip install shap"
            }
        except Exception as shap_error:
            return {
                "user_id": user_id,
                "dataset_type": datasetType,
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
