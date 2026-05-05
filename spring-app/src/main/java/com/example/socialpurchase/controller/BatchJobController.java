package com.example.socialpurchase.controller;

import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.entity.PredictionResult;
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
@RequestMapping("/jobs")
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

    @GetMapping("/{jobId}/download")
    public ResponseEntity<?> downloadResults(@PathVariable Long jobId) {
        return predictionJobRepository.findById(jobId)
                .map(job -> {
                    try {
                        List<PredictionResult> results = predictionResultRepository.findByJobId(jobId);
                        StringBuilder csv = new StringBuilder();
                        csv.append("record_id,display_id,probability,segment,model_version\n");
                        for (PredictionResult r : results) {
                            csv.append(String.format("%s,%s,%.4f,%s,%s\n",
                                    r.getRecordId(), r.getDisplayId(), r.getProbability(), r.getSegment(), r.getModelVersion()));
                        }
                        byte[] csvBytes = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
                        return ResponseEntity.ok()
                                .header("Content-Disposition", "attachment; filename=\"job_" + jobId + "_results.csv\"")
                                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                                .body(csvBytes);
                    } catch (Exception e) {
                        return ResponseEntity.status(500).body("Download failed: " + e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<?> listJobs(@RequestParam(defaultValue = "50") int limit) {
        List<PredictionJob> jobs = predictionJobRepository.findAllOrderByCreatedAtDesc();
        int end = Math.min(limit, jobs.size());
        return ResponseEntity.ok().body(jobs.subList(0, end));
    }

    @GetMapping("/{jobId}/results")
    public ResponseEntity<?> getJobResults(@PathVariable Long jobId) {
        return predictionJobRepository.findById(jobId)
                .map(job -> {
                    List<PredictionResult> results = predictionResultRepository.findByJobId(jobId);
                    return ResponseEntity.ok().body(results);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
