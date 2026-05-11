package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.JobQueue;
import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.repository.JobQueueRepository;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class JobProducerService {
    private static final Logger logger = Logger.getLogger(JobProducerService.class.getName());
    private static final String UPLOAD_DIR = "/app/uploads";

    @Autowired private JobQueueRepository jobQueueRepository;
    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private ObjectMapper objectMapper;

    public Long createJob(MultipartFile file, Long userId) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, filename);
        file.transferTo(filePath.toFile());

        PredictionJob job = new PredictionJob();
        job.setStatus("pending");
        job.setUserId(userId);
        job.setDatasetPath(filePath.toString());
        predictionJobRepository.save(job);

        JobQueue queueItem = new JobQueue();
        queueItem.setJobId(job.getId());
        queueItem.setPayload(String.format("{\"datasetPath\": \"%s\", \"jobId\": %d}", filePath, job.getId()));
        queueItem.setCreatedAt(LocalDateTime.now());
        jobQueueRepository.save(queueItem);

        logger.info(String.format("Created job %d with file %s", job.getId(), filename));
        return job.getId();
    }

    public Long createJob(String datasetPath, Long userId) {
        PredictionJob job = new PredictionJob();
        job.setStatus("pending");
        job.setUserId(userId);
        job.setDatasetPath(datasetPath);
        predictionJobRepository.save(job);

        JobQueue queueItem = new JobQueue();
        queueItem.setJobId(job.getId());
        queueItem.setPayload(String.format("{\"datasetPath\": \"%s\", \"jobId\": %d}", datasetPath, job.getId()));
        jobQueueRepository.save(queueItem);

        logger.info(String.format("Created job %d", job.getId()));
        return job.getId();
    }
}
