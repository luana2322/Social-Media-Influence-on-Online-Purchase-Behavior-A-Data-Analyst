# Nguyên Lý Ánh Xạ Tên Cột (SchemaMapper)

## Vấn đề

Model yêu cầu **17 cột đúng tên**: `PageValues`, `BounceRates`, `avg_sentiment`...  
Nhưng CSV người dùng upload có thể đặt tên khác: `page_value`, `bounce_rate`, `sentiment_avg`, `OS`...

→ Cần ánh xạ tên cột bất kỳ → 17 tên chuẩn.

---

## Cơ chế 3 bước của `findMatch()` (dòng 91-112)

```java
private String findMatch(String expected, String[] csvHeaders) {
    String normalized = normalizeName(expected);

    // BƯỚC 1: So khớp chính xác (exact match)
    for (String header : csvHeaders) {
        String h = header.trim();
        if (h.equalsIgnoreCase(expected)) return h;          // VD: "PageValues" == "pagevalues"
        if (normalizeName(h).equals(normalized)) return h;   // VD: "Page_Values" → "pagevalues"
    }

    // BƯỚC 2: Tra từ điển đồng nghĩa (alias match)
    String aliasMatch = ALIASES.get(normalized);
    if (aliasMatch != null) {
        for (String header : csvHeaders) {
            String h = header.trim();
            String hNorm = normalizeName(h);
            if (hNorm.equals(normalized)) return h;           // VD: "os" → normalize → "os" = alias "os"
            if (hNorm.equals(normalizeName(aliasMatch))) return h;
            // VD: ALIASES["os"] = "OperatingSystems"
            //     normalizeName("os") = "os"
            //     normalizeName("OperatingSystems") = "operatingsystems"
        }
    }

    // BƯỚC 3: Fuzzy match (Levenshtein distance ≥ 70%)
    for (String header : csvHeaders) {
        String h = header.trim();
        if (levenshteinSimilarity(normalizeName(h), normalized) >= 0.7) return h;
        // VD: "bouncerate" vs "bouncerates" → similarity ≈ 0.91 → match
    }

    return null;  // không tìm thấy → dùng default value
}
```

---

## Bước 1: Exact Match (dòng 93-96)

**So khớp chính xác** — không qua alias, không qua fuzzy.

```java
if (h.equalsIgnoreCase(expected)) return h;
if (normalizeName(h).equals(normalized)) return h;
```

**Giải thích:**
- `equalsIgnoreCase()`: "BOUNCERATES" == "BounceRates" → match
- `normalizeName()`: loại bỏ tất cả ký tự đặc biệt, đưa về lowercase

**Hàm `normalizeName()` (dòng 114-116):**
```java
private String normalizeName(String name) {
    return name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
}
```

| Input | Output |
|---|---|
| "PageValues" | "pagevalues" |
| "Page_Values" | "pagevalues" |
| "page value!!" | "pagevalue" |
| "Bounce-Rate%" | "bouncerate" |

**Ví dụ khớp ở bước 1:**
- Header `"PageValues"` → `equalsIgnoreCase("PageValues")` → **match**
- Header `"Page_Values"` → `normalizeName("Page_Values") = "pagevalues"` == `normalizeName("PageValues") = "pagevalues"` → **match**
- Header `"Bounce_Rate"` → `normalizeName("Bounce_Rate") = "bouncerate"` == `normalizeName("BounceRates") = "bouncerates"` → **KHÔNG match** (khác "bouncerate" vs "bouncerates") → sang bước 2

---

## Bước 2: Alias Match — Tra từ điển (dòng 98-106)

```java
String aliasMatch = ALIASES.get(normalized);
if (aliasMatch != null) {
    for (String header : csvHeaders) {
        String h = header.trim();
        String hNorm = normalizeName(h);
        if (hNorm.equals(normalized)) return h;
        if (hNorm.equals(normalizeName(aliasMatch))) return h;
    }
}
```

**Từ điển ALIASES (dòng 16-62):** chứa 40+ alias phổ biến.

**Cách hoạt động:**

1. Lấy `normalized` của tên cột cần tìm. VD: muốn tìm `"BounceRates"` → `normalized = "bouncerates"`
2. Tra `ALIASES.get("bouncerates")` → không có (vì "bouncerates" không phải alias của ai)
3. **Nhưng nếu header là `"bounce"`** → `normalized = "bounce"` → `ALIASES.get("bounce")` → `"BounceRates"`
4. Kiểm tra header nào trong CSV có `normalizeName(header) == "bounce"` → match

**Ví dụ alias hoạt động:**

| Header trong CSV | normalizeName | ALIASES.get() | Expected match |
|---|---|---|---|
| `"page_value"` | `"pagevalue"` | `"PageValues"` | `PageValues` |
| `"bounce"` | `"bounce"` | `"BounceRates"` | `BounceRates` |
| `"os"` | `"os"` | `"OperatingSystems"` | `OperatingSystems` |
| `"avg_sentiment_score"` | `"avgsentimentscore"` | `"avg_sentiment"` | `avg_sentiment` |
| `"is_weekend"` | `"isweekend"` | `"Weekend"` | `Weekend` |

---

## Bước 3: Fuzzy Match — Levenshtein Distance (dòng 107-110)

```java
for (String header : csvHeaders) {
    String h = header.trim();
    if (levenshteinSimilarity(normalizeName(h), normalized) >= 0.7) return h;
}
```

Khi không tìm thấy ở bước 1 và 2, dùng thuật toán **Levenshtein distance** để đo độ tương tự giữa 2 chuỗi.

### Levenshtein Distance là gì?

Số lượng **ký tự cần thay đổi** (thêm/xóa/sửa) để biến chuỗi A thành chuỗi B.

| Chuỗi A | Chuỗi B | Số thao tác | Khoảng cách |
|---|---|---|---|
| "bouncerate" | "bouncerates" | thêm 's' | 1 |
| "pagevlues" | "pagevalues" | sửa 'l'→'a', sửa 'v'→'a' | 2 |
| "sentiment" | "avg_sentiment" | thêm "avg_" | 4 |

### Công thức similarity (dòng 118-123)

```java
double levenshteinSimilarity(String a, String b) {
    int maxLen = Math.max(a.length(), b.length());
    int dist = levenshteinDistance(a, b);
    return 1.0 - ((double) dist / maxLen);
}
```

**Tỷ lệ tương tự = 1 - (khoảng cách / độ dài lớn nhất)**

Ngưỡng chấp nhận: **≥ 0.7** (70%).

**Ví dụ:**
- `"bouncerate"` vs `"bouncerates"`: dist=1, maxLen=11 → similarity = 1 - 1/11 = **0.909 → match**
- `"sntiment"` vs `"sentiment"`: dist=1, maxLen=9 → similarity = 1 - 1/9 = **0.888 → match**
- `"price"` vs `"global_avg_price"`: dist=9, maxLen=15 → similarity = 1 - 9/15 = **0.4 → không match**

### Code Levenshtein (dòng 126-137)

```java
private int levenshteinDistance(String a, String b) {
    int[][] dp = new int[a.length() + 1][b.length() + 1];
    for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
    for (int j = 0; j <= b.length(); j++) dp[0][j] = j;
    for (int i = 1; i <= a.length(); i++) {
        for (int j = 1; j <= b.length(); j++) {
            int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;
            dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                                dp[i - 1][j - 1] + cost);
        }
    }
    return dp[a.length()][b.length()];
}
```

**Thuật toán quy hoạch động:**
- Tạo ma trận `(len_a+1) × (len_b+1)`
- Hàng 0 và cột 0 là khoảng cách đến chuỗi rỗng
- Mỗi ô `dp[i][j]` = min của 3 ô lân cận + cost
- Kết quả là ô cuối cùng `dp[len_a][len_b]`

---

## Tổng kết luồng ánh xạ

```
expected = "BounceRates"
normalized = "bouncerates"

BƯỚC 1 — Exact:
  so header nào == "BounceRates"?     → không
  so header nào normalize == "bouncerates"? → "Bounce_Rates"? normalize="bouncerates" → MATCH!

  Nếu không match → BƯỚC 2 — Alias:
    ALIASES.get("bouncerates") → null → skip

  Nếu header = "bounce":
    normalize("bounce") = "bounce"
    ALIASES.get("bounce") = "BounceRates"
    normalize("bounce") == "bounce" → match trong alias → MATCH!

  Nếu không match → BƯỚC 3 — Fuzzy:
    similarity("bouncerate", "bouncerates") = 0.909 ≥ 0.7 → MATCH!

  Nếu không match → null → dùng default value
```

---

## Sau ánh xạ: normalizeRecord() (dòng 73-85)

Sau khi có mapping (tên CSV → tên chuẩn), mỗi dòng dữ liệu được chuẩn hóa:

```java
for (Map.Entry<String, String> entry : columnMapping.entrySet()) {
    String expected = entry.getKey();      // "BounceRates"
    String csvColumn = entry.getValue();   // "bounce_rate" (hoặc null)

    if (csvColumn != null && rawRecord.containsKey(csvColumn)) {
        normalized.put(expected, castValue(expected, rawRecord.get(csvColumn)));
    } else {
        normalized.put(expected, getDefaultValue(expected));  // cột thiếu → default
    }
}
```

### castValue() (dòng 139-149)

| Loại cột | Kiểu | Ví dụ |
|---|---|---|
| `Month`, `VisitorType` | String | "Jan", "Returning_Visitor" |
| `Weekend`, `Browser`, `Region`... | Integer | 0, 1, 2 |
| Còn lại (PageValues, BounceRates...) | Double | 80.5, 0.01 |

### getDefaultValue() (dòng 151-155)

| Cột | Default |
|---|---|
| `Month` | `""` |
| `VisitorType` | `""` |
| `Weekend` | `0` |
| Tất cả cột số | `0.0` |

---

## Kết quả cuối

Đầu vào:
```csv
page_val, bounce_rate, month
100, 0.02, Jan
```

Đầu ra (sau normalizeRecord):
```json
{
  "PageValues": 100.0,
  "BounceRates": 0.02,
  "Month": "Jan",
  ...các cột khác đều 0.0...
}
```

Luôn luôn là **17 cột đúng thứ tự**, sẵn sàng gửi cho model predict.
