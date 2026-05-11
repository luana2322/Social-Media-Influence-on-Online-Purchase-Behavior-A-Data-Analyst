package com.example.socialpurchase.controller;

import com.example.socialpurchase.entity.AnalysisSummary;
import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.entity.PredictionResult;
import com.example.socialpurchase.entity.User;
import com.example.socialpurchase.repository.AnalysisSummaryRepository;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.example.socialpurchase.repository.UserRepository;
import com.example.socialpurchase.service.JobProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/jobs")
public class BatchJobController {
    private static final Logger logger = Logger.getLogger(BatchJobController.class.getName());

    @Autowired private JobProducerService jobProducerService;
    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AnalysisSummaryRepository analysisSummaryRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Long jobId = jobProducerService.createJob(file, user.getId());
            return ResponseEntity.ok().body(String.format("{\"jobId\": %d, \"status\": \"pending\"}", jobId));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestParam("datasetPath") String datasetPath, Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Long jobId = jobProducerService.createJob(datasetPath, user.getId());
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

    @GetMapping("/my-jobs")
    public ResponseEntity<?> getMyJobs(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<PredictionJob> jobs = predictionJobRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok().body(jobs);
    }

    @PostMapping("/{jobId}/analysis-summary")
    public ResponseEntity<?> saveAnalysisSummary(@PathVariable Long jobId, @RequestBody Map<String, Object> body) {
        try {
            AnalysisSummary summary = analysisSummaryRepository.findByJobId(jobId)
                    .orElse(new AnalysisSummary());
            summary.setJobId(jobId);
            summary.setTotalRows(body.containsKey("totalRows") ? ((Number) body.get("totalRows")).intValue() : 0);
            summary.setConversions(body.containsKey("conversions") ? ((Number) body.get("conversions")).intValue() : 0);
            summary.setConversionRate((String) body.get("conversionRate"));
            summary.setRevenue((String) body.get("revenue"));
            summary.setSegments(body.get("segments") != null ? body.get("segments").toString() : "[]");
            summary.setChannels(body.get("channels") != null ? body.get("channels").toString() : "[]");
            summary.setRecommendations(body.get("recommendations") != null ? body.get("recommendations").toString() : "[]");
            analysisSummaryRepository.save(summary);
            return ResponseEntity.ok().body(Map.of("message", "Analysis summary saved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{jobId}/analysis-summary")
    public ResponseEntity<?> getAnalysisSummary(@PathVariable Long jobId) {
        var opt = analysisSummaryRepository.findByJobId(jobId);
        if (opt.isPresent()) {
            return ResponseEntity.ok().body(opt.get());
        }
        return ResponseEntity.ok().body(Map.of("message", "No analysis summary yet"));
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
