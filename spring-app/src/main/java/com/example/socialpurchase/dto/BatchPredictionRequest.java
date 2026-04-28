package com.example.socialpurchase.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class BatchPredictionRequest {
    @JsonProperty("recordId")
    private String recordId;

    @JsonProperty("features")
    private Map<String, Object> features;

    public BatchPredictionRequest() {}

    public BatchPredictionRequest(Map<String, Object> features) {
        this.recordId = features.getOrDefault("id", "unknown").toString();
        this.features = features;
    }

    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }

    public Map<String, Object> getFeatures() { return features; }
    public void setFeatures(Map<String, Object> features) { this.features = features; }
}
