package com.example.socialpurchase.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_job")
public class PredictionJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "dataset_id")
    private Long datasetId;

    @Column(name = "status")
    private String status = "pending";

    @Column(name = "dataset_path")
    private String datasetPath;

    @Column(name = "total_records")
    private Integer totalRecords = 0;

    @Column(name = "processed_records")
    private Integer processedRecords = 0;

    @Column(name = "progress_percent")
    private Float progressPercent = 0.0f;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getDatasetId() { return datasetId; }
    public void setDatasetId(Long datasetId) { this.datasetId = datasetId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDatasetPath() { return datasetPath; }
    public void setDatasetPath(String datasetPath) { this.datasetPath = datasetPath; }

    public Integer getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Integer totalRecords) { this.totalRecords = totalRecords; }

    public Integer getProcessedRecords() { return processedRecords; }
    public void setProcessedRecords(Integer processedRecords) { this.processedRecords = processedRecords; }

    public Float getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Float progressPercent) { this.progressPercent = progressPercent; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
