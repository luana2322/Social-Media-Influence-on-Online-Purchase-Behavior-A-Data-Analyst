package com.example.socialpurchase.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionResponse {
    
    @JsonProperty("purchase_probability")
    private Double purchaseProbability;
    
    @JsonProperty("model_version")
    private String modelVersion;
    
    @JsonProperty("model_type")
    private String modelType;
    
    public PredictionResponse() {}
    
    public PredictionResponse(Double purchaseProbability, String modelVersion, String modelType) {
        this.purchaseProbability = purchaseProbability;
        this.modelVersion = modelVersion;
        this.modelType = modelType;
    }
    
    public Double getPurchaseProbability() { return purchaseProbability; }
    public void setPurchaseProbability(Double purchaseProbability) { this.purchaseProbability = purchaseProbability; }
    
    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
    
    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }
}
