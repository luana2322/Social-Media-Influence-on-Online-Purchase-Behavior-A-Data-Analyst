package com.example.socialpurchase.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SchemaMapper {

    private static final Set<String> EXPECTED_COLUMNS = Set.of(
            "PageValues", "BounceRates", "ExitRates", "ProductRelated", "Administrative",
            "avg_sentiment", "total_engagement", "positive_ratio", "engagement_norm",
            "global_avg_price", "Month", "OperatingSystems", "Browser", "Region",
            "TrafficType", "VisitorType", "Weekend"
    );

    private static final Map<String, String> ALIASES = new LinkedHashMap<>();
    static {
        ALIASES.put("page_value", "PageValues");
        ALIASES.put("pagevalues", "PageValues");
        ALIASES.put("page value", "PageValues");
        ALIASES.put("page_value_session", "PageValues");
        ALIASES.put("bounce", "BounceRates");
        ALIASES.put("bouncerate", "BounceRates");
        ALIASES.put("bounce_rate", "BounceRates");
        ALIASES.put("bouncerates", "BounceRates");
        ALIASES.put("exit", "ExitRates");
        ALIASES.put("exitrate", "ExitRates");
        ALIASES.put("exit_rate", "ExitRates");
        ALIASES.put("exitrates", "ExitRates");
        ALIASES.put("product_related", "ProductRelated");
        ALIASES.put("productrelated", "ProductRelated");
        ALIASES.put("product related", "ProductRelated");
        ALIASES.put("admin", "Administrative");
        ALIASES.put("administrative_pages", "Administrative");
        ALIASES.put("sentiment_avg", "avg_sentiment");
        ALIASES.put("avg_sentiment_score", "avg_sentiment");
        ALIASES.put("average_sentiment", "avg_sentiment");
        ALIASES.put("sentiment_mean", "avg_sentiment");
        ALIASES.put("total_eng", "total_engagement");
        ALIASES.put("total_engagements", "total_engagement");
        ALIASES.put("engagement_total", "total_engagement");
        ALIASES.put("pos_ratio", "positive_ratio");
        ALIASES.put("positive_ratio", "positive_ratio");
        ALIASES.put("positive_rate", "positive_ratio");
        ALIASES.put("eng_norm", "engagement_norm");
        ALIASES.put("engagement_norm", "engagement_norm");
        ALIASES.put("normalized_engagement", "engagement_norm");
        ALIASES.put("avg_price", "global_avg_price");
        ALIASES.put("global_avg_price", "global_avg_price");
        ALIASES.put("average_price", "global_avg_price");
        ALIASES.put("global_price", "global_avg_price");
        ALIASES.put("os", "OperatingSystems");
        ALIASES.put("operating_system", "OperatingSystems");
        ALIASES.put("operatingsystems", "OperatingSystems");
        ALIASES.put("browser_type", "Browser");
        ALIASES.put("traffic_type", "TrafficType");
        ALIASES.put("trafficsource", "TrafficType");
        ALIASES.put("visitor_type", "VisitorType");
        ALIASES.put("visitortype", "VisitorType");
        ALIASES.put("is_weekend", "Weekend");
        ALIASES.put("weekend_flag", "Weekend");
    }

    public Map<String, String> mapColumns(String[] csvHeaders) {
        Map<String, String> mapping = new LinkedHashMap<>();
        for (String expected : EXPECTED_COLUMNS) {
            String matched = findMatch(expected, csvHeaders);
            mapping.put(expected, matched);
        }
        return mapping;
    }

    public Map<String, Object> normalizeRecord(Map<String, Object> rawRecord, Map<String, String> columnMapping) {
        Map<String, Object> normalized = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : columnMapping.entrySet()) {
            String expected = entry.getKey();
            String csvColumn = entry.getValue();
            if (csvColumn != null && rawRecord.containsKey(csvColumn)) {
                normalized.put(expected, castValue(expected, rawRecord.get(csvColumn)));
            } else {
                normalized.put(expected, getDefaultValue(expected));
            }
        }
        return normalized;
    }

    public Set<String> getExpectedColumns() {
        return EXPECTED_COLUMNS;
    }

    private String findMatch(String expected, String[] csvHeaders) {
        String normalized = normalizeName(expected);
        for (String header : csvHeaders) {
            String h = header.trim();
            if (h.equalsIgnoreCase(expected)) return h;
            if (normalizeName(h).equals(normalized)) return h;
        }
        String aliasMatch = ALIASES.get(normalized);
        if (aliasMatch != null) {
            for (String header : csvHeaders) {
                String h = header.trim();
                String hNorm = normalizeName(h);
                if (hNorm.equals(normalized)) return h;
                if (hNorm.equals(normalizeName(aliasMatch))) return h;
            }
        }
        for (String header : csvHeaders) {
            String h = header.trim();
            if (levenshteinSimilarity(normalizeName(h), normalized) >= 0.7) return h;
        }
        return null;
    }

    private String normalizeName(String name) {
        return name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    private double levenshteinSimilarity(String a, String b) {
        if (a.isEmpty() && b.isEmpty()) return 1.0;
        int maxLen = Math.max(a.length(), b.length());
        if (maxLen == 0) return 1.0;
        int dist = levenshteinDistance(a, b);
        return 1.0 - ((double) dist / maxLen);
    }

    private int levenshteinDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), dp[i - 1][j - 1] + cost);
            }
        }
        return dp[a.length()][b.length()];
    }

    private Object castValue(String expected, Object value) {
        if (value == null) return getDefaultValue(expected);
        String str = value.toString().trim();
        if (str.isEmpty()) return getDefaultValue(expected);
        if (expected.equals("Month") || expected.equals("VisitorType")) return str;
        if (expected.equals("Weekend") || expected.equals("OperatingSystems") ||
            expected.equals("Browser") || expected.equals("Region") || expected.equals("TrafficType")) {
            try { return Integer.parseInt(str); } catch (NumberFormatException e) { return 0; }
        }
        try { return Double.parseDouble(str); } catch (NumberFormatException e) { return 0.0; }
    }

    private Object getDefaultValue(String column) {
        if (column.equals("Month") || column.equals("VisitorType")) return "";
        if (column.equals("Weekend")) return 0;
        return 0.0;
    }
}
