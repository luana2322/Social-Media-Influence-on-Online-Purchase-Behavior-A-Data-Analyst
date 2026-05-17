package com.example.socialpurchase.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ColumnValidator {

    public Map<String, Object> validate(String[] csvHeaders, Map<String, String> columnMapping) {
        Set<String> expectedCols = new HashSet<>(columnMapping.keySet());
        List<String> missingCols = new ArrayList<>();
        List<String> mappedCols = new ArrayList<>();
        List<String> extraCols = new ArrayList<>();
        List<String> fuzzyMatched = new ArrayList<>();

        Set<String> usedCsvCols = new HashSet<>(columnMapping.values());
        usedCsvCols.remove(null);

        for (Map.Entry<String, String> entry : columnMapping.entrySet()) {
            if (entry.getValue() == null) {
                missingCols.add(entry.getKey());
            } else {
                mappedCols.add(entry.getKey());
                String csvCol = entry.getValue();
                if (!csvCol.equalsIgnoreCase(entry.getKey())) {
                    fuzzyMatched.add(entry.getKey() + " (mapped from '" + csvCol + "')");
                }
            }
        }

        Set<String> csvHeaderSet = new HashSet<>();
        for (String h : csvHeaders) {
            csvHeaderSet.add(h.trim());
        }
        for (String h : csvHeaderSet) {
            if (!usedCsvCols.contains(h)) {
                extraCols.add(h);
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total_csv_columns", csvHeaders.length);
        result.put("mapped_columns", mappedCols.size());
        result.put("missing_columns", missingCols);
        result.put("missing_count", missingCols.size());
        result.put("fuzzy_matched", fuzzyMatched);
        result.put("unused_columns", extraCols);

        List<String> warnings = new ArrayList<>();
        if (!missingCols.isEmpty()) {
            warnings.add("Missing " + missingCols.size() + " columns: " + String.join(", ", missingCols)
                    + ". Default values will be used.");
        }
        if (!extraCols.isEmpty()) {
            if (extraCols.size() <= 5) {
                warnings.add("Unused columns (ignored): " + String.join(", ", extraCols));
            } else {
                warnings.add(extraCols.size() + " columns were ignored (not used by the model).");
            }
        }
        if (!fuzzyMatched.isEmpty()) {
            warnings.add("Fuzzy-matched columns: " + String.join("; ", fuzzyMatched));
        }
        result.put("warnings", warnings);

        return result;
    }
}
