package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.AnalysisSummary;
import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.entity.PredictionResult;
import com.example.socialpurchase.repository.AnalysisSummaryRepository;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.example.socialpurchase.repository.PredictionResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationEngine {

    @Autowired private PredictionResultRepository predictionResultRepository;
    @Autowired private AnalysisSummaryRepository analysisSummaryRepository;
    @Autowired private PredictionJobRepository predictionJobRepository;

    public void generateAndSave(Long jobId) {
        List<PredictionResult> results = predictionResultRepository.findByJobId(jobId);
        if (results.isEmpty()) return;

        long total = results.size();
        long highCount = results.stream().filter(r -> "High".equals(r.getSegment())).count();
        long mediumCount = results.stream().filter(r -> "Medium".equals(r.getSegment())).count();
        long lowCount = results.stream().filter(r -> "Low".equals(r.getSegment())).count();

        double highPct = total > 0 ? (highCount * 100.0 / total) : 0;
        double mediumPct = total > 0 ? (mediumCount * 100.0 / total) : 0;
        double lowPct = total > 0 ? (lowCount * 100.0 / total) : 0;

        double avgProb = results.stream().mapToDouble(PredictionResult::getProbability).average().orElse(0);
        long conversions = results.stream().filter(r -> r.getProbability() > 0.8).count();
        double conversionRate = total > 0 ? (conversions * 100.0 / total) : 0;

        Map<String, Long> segmentDist = new LinkedHashMap<>();
        segmentDist.put("High", highCount);
        segmentDist.put("Medium", mediumCount);
        segmentDist.put("Low", lowCount);

        List<String> recommendations = new ArrayList<>();

        if (highPct > 20) {
            recommendations.add(String.format(
                    "%.0f%% sessions have >80%% purchase probability. Action: Target these users with limited-time offers before they leave.",
                    highPct));
        } else if (highPct > 5) {
            recommendations.add(String.format(
                    "%.0f%% sessions show high purchase intent. Action: Send personalized product recommendations to this segment.",
                    highPct));
        } else {
            recommendations.add(String.format(
                    "Only %.0f%% sessions have high purchase probability. Consider improving targeting or increasing high-intent traffic.",
                    highPct));
        }

        if (lowPct > 50) {
            recommendations.add(String.format(
                    "%.0f%% sessions have low purchase probability. Action: Run retargeting campaigns with social proof ads and testimonials.",
                    lowPct));
        } else if (lowPct > 30) {
            recommendations.add(String.format(
                    "%.0f%% sessions are low probability. Action: Nurture with brand awareness content and educational emails.",
                    lowPct));
        }

        if (mediumPct > 30) {
            recommendations.add(String.format(
                    "%.0f%% sessions are in the medium segment (potential converters). Action: Offer free shipping or limited-time discounts.",
                    mediumPct));
        }

        if (avgProb < 0.3) {
            recommendations.add(
                    "Overall purchase probability is low. Consider: (a) optimizing landing page UX, (b) improving ad targeting, (c) running A/B tests on checkout flow.");
        } else if (avgProb > 0.5) {
            recommendations.add(
                    "Overall purchase probability is high. Maintain current strategy and focus on upselling and cross-selling to maximize revenue.");
        }

        if (conversionRate > 15) {
            recommendations.add(String.format(
                    "Estimated conversion rate: %.1f%%. Action: Analyze top-performing channels and allocate more budget there.",
                    conversionRate));
        } else {
            recommendations.add(String.format(
                    "Estimated conversion rate: %.1f%%. Action: Identify friction points in the customer journey and run conversion rate optimization tests.",
                    conversionRate));
        }

        recommendations.add(
                "Monitor predictions over time: schedule recurring uploads to track changes in segment distribution and measure campaign impact.");

        AnalysisSummary summary = analysisSummaryRepository.findByJobId(jobId)
                .orElse(new AnalysisSummary());
        summary.setJobId(jobId);
        summary.setTotalRows((int) total);
        summary.setConversions((int) conversions);
        summary.setConversionRate(String.format("%.2f%%", conversionRate));
        summary.setSegments(segmentDist.toString());
        summary.setRecommendations(recommendations.toString());
        summary.setChannels("[]");
        analysisSummaryRepository.save(summary);
    }
}
