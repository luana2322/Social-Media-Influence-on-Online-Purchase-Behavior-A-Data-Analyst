package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.AnalysisSummary;
import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.entity.PredictionResult;
import com.example.socialpurchase.repository.AnalysisSummaryRepository;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.example.socialpurchase.repository.PredictionResultRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationEngine {

    @Autowired private PredictionResultRepository predictionResultRepository;
    @Autowired private AnalysisSummaryRepository analysisSummaryRepository;
    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private ObjectMapper objectMapper;

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

        List<Map<String, Object>> segments = List.of(
            Map.of("name", "hot", "count", highCount, "pct", Math.round(highPct)),
            Map.of("name", "warm", "count", mediumCount, "pct", Math.round(mediumPct)),
            Map.of("name", "cold", "count", lowCount, "pct", Math.round(lowPct))
        );

        List<String> recommendations = new ArrayList<>();

        if (highPct > 20) {
            recommendations.add(String.format(
                    "%.0f%% khách hàng thuộc phân khúc nóng (>80%% xác suất mua). Hành động: Nhắm flash sale 24h qua email + SMS.",
                    highPct));
        } else if (highPct > 5) {
            recommendations.add(String.format(
                    "%.0f%% khách hàng có ý định mua cao. Hành động: Gửi đề xuất sản phẩm cá nhân hóa tới phân khúc này.",
                    highPct));
        } else {
            recommendations.add(String.format(
                    "Chỉ %.0f%% khách hàng có xác suất mua cao. Cân nhắc cải thiện targeting hoặc tăng traffic chất lượng.",
                    highPct));
        }

        if (lowPct > 50) {
            recommendations.add(String.format(
                    "%.0f%% khách hàng có xác suất mua thấp. Hành động: Chạy retargeting với quảng cáo bằng chứng xã hội và đánh giá.",
                    lowPct));
        } else if (lowPct > 30) {
            recommendations.add(String.format(
                    "%.0f%% khách hàng xác suất thấp. Hành động: Nuôi dưỡng bằng nội dung nhận thức thương hiệu và email giáo dục.",
                    lowPct));
        }

        if (mediumPct > 30) {
            recommendations.add(String.format(
                    "%.0f%% khách hàng ở phân khúc ấm (tiềm năng chuyển đổi). Hành động: Miễn phí vận chuyển hoặc giảm giá có thời hạn.",
                    mediumPct));
        }

        if (avgProb < 0.3) {
            recommendations.add(
                    "Xác suất mua tổng thể thấp. Cân nhắc: (a) tối ưu UX landing page, (b) cải thiện targeting quảng cáo, (c) chạy A/B test luồng thanh toán.");
        } else if (avgProb > 0.5) {
            recommendations.add(
                    "Xác suất mua tổng thể cao. Duy trì chiến lược hiện tại, tập trung upselling và cross-selling để tối đa doanh thu.");
        }

        if (conversionRate > 15) {
            recommendations.add(String.format(
                    "Tỷ lệ chuyển đổi ước tính: %.1f%%. Hành động: Phân tích kênh hiệu suất cao nhất và phân bổ thêm ngân sách.",
                    conversionRate));
        } else {
            recommendations.add(String.format(
                    "Tỷ lệ chuyển đổi ước tính: %.1f%%. Hành động: Xác định điểm nghẽn trong hành trình khách hàng và tối ưu.",
                    conversionRate));
        }

        recommendations.add(
                "Theo dõi dự đoán theo thời gian: lên lịch upload định kỳ để theo dõi thay đổi phân phối phân khúc và đo lường tác động chiến dịch.");

        AnalysisSummary summary = analysisSummaryRepository.findByJobId(jobId)
                .orElse(new AnalysisSummary());
        summary.setJobId(jobId);
        summary.setTotalRows((int) total);
        summary.setConversions((int) conversions);
        summary.setConversionRate(String.format("%.2f%%", conversionRate));
        try {
            summary.setSegments(objectMapper.writeValueAsString(segments));
            summary.setRecommendations(objectMapper.writeValueAsString(recommendations));
        } catch (Exception e) {
            summary.setSegments(segments.toString());
            summary.setRecommendations(recommendations.toString());
        }
        summary.setChannels("[]");
        analysisSummaryRepository.save(summary);
    }
}
