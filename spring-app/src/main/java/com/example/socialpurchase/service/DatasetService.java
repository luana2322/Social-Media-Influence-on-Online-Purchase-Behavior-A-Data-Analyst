package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.Dataset;
import com.example.socialpurchase.repository.DatasetRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.UUID;

@Service
public class DatasetService {

    @Value("${llm.enabled:false}")
    private boolean llmEnabled;

    @Value("${upload.dir:./uploads}")
    private String uploadDir;

    private final DatasetRepository datasetRepository;
    private final ObjectMapper objectMapper;

    public DatasetService(DatasetRepository datasetRepository, ObjectMapper objectMapper) {
        this.datasetRepository = datasetRepository;
        this.objectMapper = objectMapper;
    }

    public Dataset uploadDataset(MultipartFile file, Long userId) throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        file.transferTo(filePath.toFile());

        List<String> headers = readCSVHeaders(filePath.toString());

        Dataset dataset = new Dataset();
        dataset.setUserId(userId);
        dataset.setFileName(file.getOriginalFilename());
        dataset.setFilePath(filePath.toString());
        dataset.setStatus("uploaded");
        datasetRepository.save(dataset);

        return dataset;
    }

    public Map<String, String> autoDetectColumnMapping(List<String> userColumns, List<String> modelFeatures) {
        Map<String, String> mapping = new HashMap<>();

        for (String modelFeature : modelFeatures) {
            String bestMatch = findBestMatch(modelFeature, userColumns);
            if (bestMatch != null) {
                mapping.put(bestMatch, modelFeature);
            }
        }

        addHeuristicMappings(mapping, userColumns, modelFeatures);
        return mapping;
    }

    private String findBestMatch(String target, List<String> candidates) {
        String bestMatch = null;
        int bestScore = Integer.MAX_VALUE;

        String targetClean = target.toLowerCase().replaceAll("[^a-z0-9]", "");

        for (String candidate : candidates) {
            String candidateClean = candidate.toLowerCase().replaceAll("[^a-z0-9]", "");
            int distance = levenshteinDistance(targetClean, candidateClean);
            if (distance < bestScore && distance <= 3) {
                bestScore = distance;
                bestMatch = candidate;
            }
        }
        return bestMatch;
    }

    private void addHeuristicMappings(Map<String, String> mapping, List<String> userColumns, List<String> modelFeatures) {
        Map<String, String> keywordMap = new HashMap<>();
        keywordMap.put("price", "global_avg_price");
        keywordMap.put("engagement", "total_engagement");
        keywordMap.put("bounce", "BounceRates");
        keywordMap.put("exit", "ExitRates");
        keywordMap.put("page", "PageValues");
        keywordMap.put("sentiment", "avg_sentiment");
        keywordMap.put("admin", "Administrative");
        keywordMap.put("product", "ProductRelated");

        for (String userCol : userColumns) {
            if (mapping.containsKey(userCol)) continue;

            String lower = userCol.toLowerCase();
            for (Map.Entry<String, String> entry : keywordMap.entrySet()) {
                if (lower.contains(entry.getKey()) && modelFeatures.contains(entry.getValue())) {
                    mapping.put(userCol, entry.getValue());
                    break;
                }
            }
        }
    }

    private int levenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= s2.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= s1.length(); i++) {
            for (int j = 1; j <= s2.length(); j++) {
                if (s1.charAt(i-1) == s2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i-1][j], Math.min(dp[i][j-1], dp[i-1][j-1]));
                }
            }
        }
        return dp[s1.length()][s2.length()];
    }

    private List<String> readCSVHeaders(String filePath) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line = br.readLine();
            if (line != null) {
                return Arrays.asList(line.split(","));
            }
        }
        return new ArrayList<>();
    }

    public void saveColumnMapping(Long datasetId, Map<String, String> mapping) throws Exception {
        Dataset dataset = datasetRepository.findById(datasetId).orElseThrow();
        dataset.setColumnMapping(objectMapper.writeValueAsString(mapping));
        dataset.setStatus("mapped");
        datasetRepository.save(dataset);
    }
}
