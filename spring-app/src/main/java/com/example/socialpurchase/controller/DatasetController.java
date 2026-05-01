package com.example.socialpurchase.controller;

import com.example.socialpurchase.entity.Dataset;
import com.example.socialpurchase.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/datasets")
public class DatasetController {
    private static final Logger logger = Logger.getLogger(DatasetController.class.getName());

    @Autowired private DatasetService datasetService;
    @Autowired private com.example.socialpurchase.repository.DatasetRepository datasetRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file,
                                           @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        try {
            Dataset dataset = datasetService.uploadDataset(file, userId);
            return ResponseEntity.ok().body(Map.of(
                "datasetId", dataset.getId(),
                "fileName", dataset.getFileName(),
                "status", dataset.getStatus()
            ));
        } catch (Exception e) {
            logger.severe("Upload error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{datasetId}/suggest-mapping")
    public ResponseEntity<?> suggestMapping(@PathVariable Long datasetId) {
        try {
            Dataset dataset = datasetRepository.findById(datasetId).orElseThrow();
            List<String> modelFeatures = List.of(
                "PageValues", "BounceRates", "ExitRates", "ProductRelated",
                "Administrative", "avg_sentiment", "total_engagement", "positive_ratio",
                "engagement_norm", "global_avg_price", "Month", "OperatingSystems",
                "Browser", "Region", "TrafficType", "VisitorType", "Weekend"
            );

            Map<String, String> mapping = datasetService.autoDetectColumnMapping(
                List.of(dataset.getFileName().split(",")), modelFeatures
            );

            return ResponseEntity.ok().body(Map.of("mapping", mapping));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{datasetId}/mapping")
    public ResponseEntity<?> saveMapping(@PathVariable Long datasetId,
                                         @RequestBody Map<String, String> mapping) {
        try {
            datasetService.saveColumnMapping(datasetId, mapping);
            return ResponseEntity.ok().body(Map.of("status", "success"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
