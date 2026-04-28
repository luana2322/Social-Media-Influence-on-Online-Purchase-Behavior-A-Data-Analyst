package com.example.socialpurchase.controller;

import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.example.socialpurchase.service.JobProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/jobs")
public class BatchJobController {
    private static final Logger logger = Logger.getLogger(BatchJobController.class.getName());

    @Autowired private JobProducerService jobProducerService;
    @Autowired private PredictionJobRepository predictionJobRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file) {
        try {
            Long jobId = jobProducerService.createJob(file);
            return ResponseEntity.ok().body(String.format("{\"jobId\": %d, \"status\": \"pending\"}", jobId));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestParam("datasetPath") String datasetPath) {
        try {
            Long jobId = jobProducerService.createJob(datasetPath);
            return ResponseEntity.ok().body(String.format("{\"jobId\": %d, \"status\": \"pending\"}", jobId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Job creation failed: " + e.getMessage());
        }
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<?> getJobStatus(@PathVariable Long jobId) {
        return predictionJobRepository.findById(jobId)
                .map(job -> ResponseEntity.ok().body(job))
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private com.example.socialpurchase.repository.PredictionResultRepository predictionResultRepository;

    @GetMapping("/{jobId}/results")
    public ResponseEntity<?> getJobResults(@PathVariable Long jobId) {
        return predictionJobRepository.findById(jobId)
                .map(job -> {
                    try {
                        return ResponseEntity.ok().body(predictionResultRepository.findByJobId(jobId));
                    } catch (Exception e) {
                        return ResponseEntity.status(500).body("Error loading results: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<?> listJobs(@RequestParam(defaultValue = "10") int limit) {
        List<PredictionJob> jobs = predictionJobRepository.findAll();
        return ResponseEntity.ok().body(jobs.subList(0, Math.min(limit, jobs.size())));
    }
}
