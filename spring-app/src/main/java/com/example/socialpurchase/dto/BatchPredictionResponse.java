package com.example.socialpurchase.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BatchPredictionResponse {
    @JsonProperty("recordId")
    private String recordId;

    @JsonProperty("probability")
    private Double probability;

    @JsonProperty("segment")
    private String segment;

    @JsonProperty("modelVersion")
    private String modelVersion;

    public BatchPredictionResponse() {}

    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }

    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }

    public String getSegment() { return segment; }
    public void setSegment(String segment) { this.segment = segment; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
}
