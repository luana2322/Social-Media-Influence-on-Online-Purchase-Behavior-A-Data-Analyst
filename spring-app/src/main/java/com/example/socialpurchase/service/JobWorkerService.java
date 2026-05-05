package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.JobQueue;
import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.repository.JobQueueRepository;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class JobWorkerService {
    private static final Logger logger = Logger.getLogger(JobWorkerService.class.getName());
    private static final String WORKER_ID = UUID.randomUUID().toString();
    private static final int POLL_INTERVAL_MS = 5000;
    private static final int STALE_LOCK_MINUTES = 10;

    @Autowired private JobQueueRepository jobQueueRepository;
    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private DatasetStreamingService datasetStreamingService;
    @Autowired private ObjectMapper objectMapper;

    public void startWorker() {
        logger.info("Starting JobWorker with ID: " + WORKER_ID);
        new Thread(() -> {
            while (true) {
                try {
                    processNextJob();
                    Thread.sleep(POLL_INTERVAL_MS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    logger.warning("Worker thread interrupted");
                    break;
                } catch (Exception e) {
                    logger.severe("Worker error: " + e.getMessage());
                }
            }
        }, "job-worker-" + WORKER_ID.substring(0, 8)).start();
    }

    private void processNextJob() {
        Optional<JobQueue> jobOpt = jobQueueRepository.findPendingJobWithSkipLocked();

        if (jobOpt.isEmpty()) return;

        JobQueue jobQueue = jobOpt.get();
        logger.info(String.format("Processing job queue ID: %d for job ID: %d",
                jobQueue.getId(), jobQueue.getJobId()));

        try {
            lockJob(jobQueue);
            processJob(jobQueue);
            markJobDone(jobQueue);
        } catch (Exception e) {
            handleJobFailure(jobQueue, e);
        }
    }

    private void lockJob(JobQueue jobQueue) {
        jobQueue.setStatus("processing");
        jobQueue.setLockedBy(WORKER_ID);
        jobQueue.setLockedAt(LocalDateTime.now());
        jobQueueRepository.saveAndFlush(jobQueue);
    }

    private void processJob(JobQueue jobQueue) throws Exception {
        JsonNode payload = objectMapper.readTree(jobQueue.getPayload());
        String datasetPath = payload.get("datasetPath").asText();
        Long jobId = payload.get("jobId").asLong();

        PredictionJob predictionJob = predictionJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("PredictionJob not found: " + jobId));
        predictionJob.setStatus("processing");
        predictionJobRepository.saveAndFlush(predictionJob);
        logger.info(String.format("Job %d set to processing, streaming dataset: %s", jobId, datasetPath));

        datasetStreamingService.streamAndProcess(datasetPath, jobId);

        // Re-fetch to get latest state after streaming updates
        predictionJob = predictionJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("PredictionJob not found after streaming: " + jobId));
        predictionJob.setStatus("completed");
        predictionJob.setCompletedAt(LocalDateTime.now());
        predictionJobRepository.saveAndFlush(predictionJob);
        logger.info(String.format("Job %d marked as completed", jobId));
    }

    private void markJobDone(JobQueue jobQueue) {
        jobQueue.setStatus("done");
        jobQueueRepository.save(jobQueue);
    }

    private void handleJobFailure(JobQueue jobQueue, Exception e) {
        int retries = jobQueue.getRetries() + 1;
        jobQueue.setRetries(retries);

        logger.severe(String.format("Job queue %d failed (attempt %d/%d): %s",
                jobQueue.getId(), retries, jobQueue.getMaxRetries(), e.getMessage()));

        if (retries >= jobQueue.getMaxRetries()) {
            jobQueue.setStatus("failed");
            jobQueue.setLockedBy(null);
            jobQueue.setLockedAt(null);

            if (jobQueue.getJobId() != null) {
                predictionJobRepository.findById(jobQueue.getJobId()).ifPresent(job -> {
                    job.setStatus("failed");
                    job.setErrorMessage(e.getMessage());
                    predictionJobRepository.save(job);
                });
            }
        } else {
            jobQueue.setStatus("pending");
            jobQueue.setLockedBy(null);
            jobQueue.setLockedAt(null);
        }
        jobQueueRepository.save(jobQueue);
    }
}
