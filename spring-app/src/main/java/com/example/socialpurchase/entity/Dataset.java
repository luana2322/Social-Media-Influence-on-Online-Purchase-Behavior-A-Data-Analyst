package com.example.socialpurchase.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "datasets")
public class Dataset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "column_mapping", columnDefinition = "JSONB")
    private String columnMapping;

    @Column(name = "row_count")
    private Integer rowCount;

    @Column(name = "status")
    private String status = "uploaded";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getColumnMapping() { return columnMapping; }
    public void setColumnMapping(String columnMapping) { this.columnMapping = columnMapping; }

    public Integer getRowCount() { return rowCount; }
    public void setRowCount(Integer rowCount) { this.rowCount = rowCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
