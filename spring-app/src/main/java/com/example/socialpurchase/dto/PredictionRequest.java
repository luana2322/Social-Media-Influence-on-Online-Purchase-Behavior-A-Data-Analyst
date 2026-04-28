package com.example.socialpurchase.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class PredictionRequest {
    
    @NotNull(message = "PageValues is required")
    @PositiveOrZero(message = "PageValues must be >= 0")
    @JsonProperty("PageValues")
    private Double pageValues;
    
    @NotNull(message = "BounceRates is required")
    @DecimalMin(value = "0.0", message = "BounceRates must be >= 0")
    @JsonProperty("BounceRates")
    private Double bounceRates;
    
    @NotNull(message = "ExitRates is required")
    @DecimalMin(value = "0.0", message = "ExitRates must be >= 0")
    @JsonProperty("ExitRates")
    private Double exitRates;
    
    @NotNull(message = "ProductRelated is required")
    @PositiveOrZero(message = "ProductRelated must be >= 0")
    @JsonProperty("ProductRelated")
    private Double productRelated;
    
    @NotNull(message = "Administrative is required")
    @PositiveOrZero(message = "Administrative must be >= 0")
    @JsonProperty("Administrative")
    private Double administrative;
    
    @NotNull(message = "avg_sentiment is required")
    @JsonProperty("avg_sentiment")
    private Double avgSentiment;
    
    @NotNull(message = "total_engagement is required")
    @PositiveOrZero(message = "total_engagement must be >= 0")
    @JsonProperty("total_engagement")
    private Double totalEngagement;
    
    @NotNull(message = "positive_ratio is required")
    @JsonProperty("positive_ratio")
    private Double positiveRatio;
    
    @NotNull(message = "engagement_norm is required")
    @JsonProperty("engagement_norm")
    private Double engagementNorm;
    
    @NotNull(message = "global_avg_price is required")
    @PositiveOrZero(message = "global_avg_price must be >= 0")
    @JsonProperty("global_avg_price")
    private Double globalAvgPrice;
    
    @NotNull(message = "Month is required")
    @JsonProperty("Month")
    private String month;
    
    @NotNull(message = "OperatingSystems is required")
    @JsonProperty("OperatingSystems")
    private Integer operatingSystems;
    
    @NotNull(message = "Browser is required")
    @JsonProperty("Browser")
    private Integer browser;
    
    @NotNull(message = "Region is required")
    @JsonProperty("Region")
    private Integer region;
    
    @NotNull(message = "TrafficType is required")
    @JsonProperty("TrafficType")
    private Integer trafficType;
    
    @NotNull(message = "VisitorType is required")
    @JsonProperty("VisitorType")
    private String visitorType;
    
    @NotNull(message = "Weekend is required")
    @JsonProperty("Weekend")
    private Integer weekend;
    
    public PredictionRequest() {}
    
    // Getters and Setters
    public Double getPageValues() { return pageValues; }
    public void setPageValues(Double pageValues) { this.pageValues = pageValues; }
    
    public Double getBounceRates() { return bounceRates; }
    public void setBounceRates(Double bounceRates) { this.bounceRates = bounceRates; }
    
    public Double getExitRates() { return exitRates; }
    public void setExitRates(Double exitRates) { this.exitRates = exitRates; }
    
    public Double getProductRelated() { return productRelated; }
    public void setProductRelated(Double productRelated) { this.productRelated = productRelated; }
    
    public Double getAdministrative() { return administrative; }
    public void setAdministrative(Double administrative) { this.administrative = administrative; }
    
    public Double getAvgSentiment() { return avgSentiment; }
    public void setAvgSentiment(Double avgSentiment) { this.avgSentiment = avgSentiment; }
    
    public Double getTotalEngagement() { return totalEngagement; }
    public void setTotalEngagement(Double totalEngagement) { this.totalEngagement = totalEngagement; }
    
    public Double getPositiveRatio() { return positiveRatio; }
    public void setPositiveRatio(Double positiveRatio) { this.positiveRatio = positiveRatio; }
    
    public Double getEngagementNorm() { return engagementNorm; }
    public void setEngagementNorm(Double engagementNorm) { this.engagementNorm = engagementNorm; }
    
    public Double getGlobalAvgPrice() { return globalAvgPrice; }
    public void setGlobalAvgPrice(Double globalAvgPrice) { this.globalAvgPrice = globalAvgPrice; }
    
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    
    public Integer getOperatingSystems() { return operatingSystems; }
    public void setOperatingSystems(Integer operatingSystems) { this.operatingSystems = operatingSystems; }
    
    public Integer getBrowser() { return browser; }
    public void setBrowser(Integer browser) { this.browser = browser; }
    
    public Integer getRegion() { return region; }
    public void setRegion(Integer region) { this.region = region; }
    
    public Integer getTrafficType() { return trafficType; }
    public void setTrafficType(Integer trafficType) { this.trafficType = trafficType; }
    
    public String getVisitorType() { return visitorType; }
    public void setVisitorType(String visitorType) { this.visitorType = visitorType; }
    
    public Integer getWeekend() { return weekend; }
    public void setWeekend(Integer weekend) { this.weekend = weekend; }
}
