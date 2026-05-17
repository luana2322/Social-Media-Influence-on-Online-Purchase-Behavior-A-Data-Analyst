# Giải Thích Chi Tiết Data_Fusion_Project.ipynb

## Tổng Quan

Notebook thực hiện **Data Fusion** — kết hợp 3 dataset riêng biệt (eCommerce, Twitter, Amazon) để phân tích ảnh hưởng của social media lên hành vi mua hàng online. Kết quả là một fused dataset 200,000 dòng × 42 cột.

---

## I. CÁC BƯỚC (STEPS)

### Step 1: Setup & Configuration (Cell 1 - Code)

**Mục đích:** Import thư viện, cấu hình tham số.

**Các biến cấu hình:**
- `SAMPLE_SIZE = 200_000`: Số dòng tối đa lấy từ mỗi dataset
- `RANDOM_STATE = 42`: Seed cho reproducibility
- `DATA_DIR = 'dataraw'`: Thư mục chứa dữ liệu gốc
- `OUTPUT_DIR = 'output'`: Thư mục lưu kết quả

**Thư viện chính:**
- `pandas`, `numpy`: Xử lý dữ liệu
- `matplotlib`, `seaborn`: Vẽ biểu đồ
- `sklearn`: Machine Learning models

---

### Step 2: Load Raw Data (Cell 2 - Code)

**Mục đích:** Đọc 3 file CSV gốc.

| File | Số dòng | Số cột | Mô tả |
|---|---|---|---|
| `online_shoppers.csv` | 200,000 | 18 | Hành vi session mua sắm |
| `twitter_sentiment_dataset.csv` | 200,000 | 33 | Tweet + sentiment |
| `amz_br_total_products_data_processed.csv` | 200,000 | 11 | Sản phẩm Amazon Brazil |

**Hàm:** `pd.read_csv(nrows=SAMPLE_SIZE)` — giới hạn số dòng để cân bằng performance.

---

### Step 3: Data Quality Assessment (Markdown)

**Mục đích:** Liệt kê các vấn đề chất lượng dữ liệu trước khi xử lý.

**Chia làm 2 nhóm:**

**A. Content Issues (vấn đề về giá trị):**
| Dataset | Vấn đề | Cách xử lý |
|---|---|---|
| eCommerce | Thiếu giá trị numeric | Điền median |
| eCommerce | `Revenue` là string 'True'/'False' | Map → 0/1 |
| eCommerce | `Weekend` là boolean string | Map → 0/1 |
| eCommerce | Duration âm | Clip về 0 |
| Social | Thiếu like_count, retweet_count | Điền 0 |
| Social | sentiment_score ngoài [-1, 1] | Clip |
| Social | created_at sai định dạng | `pd.to_datetime(errors='coerce')` |
| Product | Thiếu stars, reviews, boughtInLastMonth | Điền median/0 |
| Product | price <= 0 | Xóa dòng |
| Product | isBestSeller là string | Map → 0/1 |

**B. Structural Issues (vấn đề cấu trúc):**
| Vấn đề | Giải pháp |
|---|---|
| Month là string ('Jan','Feb',...) | Map thành số 1-12 |
| VisitorType free-text | Encode thành is_returning |
| Cột Unnamed từ CSV export | Xóa |
| Duplicate tweets theo id | Deduplicate |
| sentiment mixed case | Chuẩn hóa lowercase |
| Duplicate sản phẩm theo asin | Deduplicate |
| categoryName là text tiếng BĐN | Keyword matching → broad_category |
| **Không có khóa chung giữa 3 datasets** | Fusion: join theo tháng + broadcast |

---

### Step 4: Data Cleaning (Cell 3 - Code)

#### Hàm `clean_ecommerce(df)`

**Input:** DataFrame eCommerce raw.

**Xử lý:**
1. `d['Revenue']`: Chuyển string 'True'/'False' → int 0/1
2. `d['Weekend']`: Chuyển string → int
3. Vòng lặp `num_cols`: Chuyển về numeric, điền NaN bằng median
4. Clip các cột Duration (không thể âm)
5. `month_map`: 'Jan'→1, 'Feb'→2,..., 'Dec'→12 → tạo cột `Month_num`
6. `is_returning`: 1 nếu VisitorType là 'Returning_Visitor', ngược lại 0

**Output:** DataFrame sạch, thêm 2 cột `Month_num`, `is_returning`.

#### Hàm `clean_social(df)`

**Input:** DataFrame Twitter raw.

**Xử lý:**
1. Xóa cột bắt đầu bằng 'Unnamed'
2. `drop_duplicates(subset=['id'])` — xóa tweet trùng
3. `pd.to_datetime(created_at, errors='coerce')` — parse ngày, trích xuất `Month_num`
4. Chuẩn hóa sentiment: lower + strip, nếu không phải positive/negative/neutral → 'neutral'
5. Clip `sentiment_score` về [-1, 1]
6. Điền 0 cho like_count, retweet_count, reply_count, impression_count nếu thiếu

**Output:** DataFrame sạch, thêm cột `Month_num`.

#### Hàm `map_category(cat_str)` và `CATEGORY_KEYWORDS`

**Mục đích:** Map categoryName tiếng Bồ Đào Nha → broad category tiếng Anh.

**Cơ chế:** Keyword matching — nếu chuỗi category chứa từ khóa nào thì gán category tương ứng.

**Ví dụ:**
- `'eletr'` hoặc `'tv'` hoặc `'celular'` → 'Electronics'
- `'game'` hoặc `'console'` → 'Gaming'
- `'bebê'` hoặc `'infantil'` → 'Baby'

**8 categories:**
| Category | Keywords (Portuguese) |
|---|---|
| Electronics | eletr, tv, celular, computador, câmera, tablet, video, áudio, som, fone |
| Gaming | game, jogo, console, playstation, xbox, nintendo |
| Sports | esporte, fitness, treino, musculação, bicicleta |
| Clothing | moda, roupa, tênis, sapato, vestuário, calçado |
| Beauty | beleza, cosmétic, perfume, cabelo, skincare |
| Home | casa, cozinha, móvel, decoração, jardim, ferrament |
| Books | livro, literatura, educação |
| Baby | bebê, infantil, brinquedo, criança |

#### Hàm `clean_product(df)`

**Input:** DataFrame Amazon raw.

**Xử lý:**
1. Chuyển price, listPrice, stars, reviews, boughtInLastMonth → numeric
2. `d = d[d['price'] > 0]` — xóa sản phẩm giá <= 0
3. `drop_duplicates(subset=['asin'])` — xóa trùng theo mã sản phẩm
4. Điền missing: price, stars → median; reviews, boughtInLastMonth, listPrice → 0
5. `d['broad_category'] = d['categoryName'].apply(map_category)`
6. isBestSeller string → int 0/1

**Output:** DataFrame sạch, thêm cột `broad_category`.

---

### Step 5: Feature Engineering (Cell 4 - Code)

#### Hàm `classify_tweet(text)` và `TWEET_KEYWORDS`

**Mục đích:** Phân loại tweet theo category dựa trên nội dung (tiếng Anh).

**Cơ chế:** Tương tự map_category nhưng dùng từ khóa tiếng Anh.

| Category | Keywords (English) |
|---|---|
| Electronics | phone, laptop, camera, tech, gadget, device, electronic, tv, tablet, smartphone |
| Gaming | game, gaming, console, playstation, xbox, nintendo, esport |
| Sports | sport, fitness, gym, workout, exercise, running, training |
| Clothing | fashion, clothes, wear, style, outfit, shirt, dress, shoe |
| Beauty | beauty, makeup, cosmetic, skincare, hair, perfume, lipstick |
| Home | home, house, decor, furniture, kitchen, interior, garden |
| Books | book, read, novel, author, literature, kindle |

#### Hàm `engineer_social(df)`

**Tạo features:**
- `engagement = like_count + retweet_count + reply_count` — tổng tương tác
- `sentiment_norm = (sentiment_score + 1) / 2` — chuẩn hóa sentiment về [0, 1]
- `tweet_category = classify_tweet(text)` — category của tweet

#### Hàm `engineer_product(df)`

**Tạo features:**
- `popularity_score = stars × log(reviews + 1)` — điểm phổ biến
- `discount_ratio = (listPrice - price) / listPrice` — tỷ lệ giảm giá (nếu listPrice > 0)
- `price_tier = pd.qcut(price, q=4, labels=['Low','Med-Low','Med-High','High'])` — phân khúc giá

#### Hàm `engineer_ecommerce(df)`

**Tạo features:**
- `total_pages = Administrative + Informational + ProductRelated` — tổng số trang
- `product_page_ratio = ProductRelated / total_pages` — tỷ lệ trang sản phẩm
- `session_intensity = total_pages × (1 - BounceRates)` — cường độ session
- `log_ProductRelated_Duration`, `log_Administrative_Duration`, `log_PageValues` — log-transform

---

### Step 6: Data Fusion - 3 Phases (Cell 5 - Code)

Đây là bước quan trọng nhất. Vì 3 dataset **không có khóa chung**, cần chiến lược fusion đặc biệt.

#### Phase 1: Social × eCommerce (Month join)

**Hàm `fuse_social_ecommerce(ecom_df, soc_df)`**

1. Group Twitter theo `Month_num`:
   ```python
   monthly_agg = soc_df.groupby('Month_num').agg(
       avg_sentiment      = ('sentiment_score', 'mean'),
       total_engagement   = ('engagement', 'sum'),
       mention_count      = ('id', 'count'),
       positive_ratio     = ('sentiment', lambda x: (x == 'positive').mean()),
       negative_ratio     = ('sentiment', lambda x: (x == 'negative').mean()),
       avg_engagement     = ('engagement', 'mean'),
   )
   ```
2. Chuẩn hóa `engagement_norm = total_engagement / max(total_engagement)` về [0, 1]
3. LEFT JOIN `ecom_df.merge(monthly_agg, on='Month_num', how='left')`
4. Fill NaN cho tháng không có dữ liệu Twitter: avg_sentiment→0, positive_ratio→0.33, etc.

**Kết quả:** Mỗi session eCommerce có thêm thông tin sentiment tổng hợp theo tháng.

#### Phase 2: Amazon Product Broadcast

**Hàm `fuse_product_broadcast(fused_df, prod_df)`**

Tính statistics global từ toàn bộ sản phẩm Amazon:
```python
stats = {
    'global_avg_price':        prod_df['price'].mean(),
    'global_median_price':     prod_df['price'].median(),
    'global_avg_stars':        prod_df['stars'].mean(),
    'global_avg_popularity':   prod_df['popularity_score'].mean(),
    'global_bestseller_ratio': prod_df['isBestSeller'].mean(),
    'global_avg_discount':     prod_df['discount_ratio'].mean(),
}
```

Sau đó **broadcast** (gán) các giá trị này vào mọi session — vì không có key để join.

#### Phase 3: Cross-features

Tạo interaction features chỉ có được nhờ data fusion:
- `sentiment_x_pagevalue = avg_sentiment × PageValues` — sentiment × giá trị session
- `engagement_x_product_ratio = engagement_norm × product_page_ratio` — engagement × tỷ lệ trang sản phẩm
- `pagevalue_vs_global_price = PageValues / (global_avg_price + 1)` — giá trị session so với giá trung bình

#### Hàm `build_category_frames(soc_df, prod_df)`

Tạo 2 DataFrame phục vụ phân tích category (Q3, Q4):
- `social_cats`: Mention count theo tweet_category
- `amazon_cats`: Product count, avg_price, total_sales theo broad_category

#### Hàm `store_to_sqlite(df, db_path)`

Lưu fused dataset vào SQLite database và CSV.

---

### Step 7: Exploratory Data Analysis (Cell 7 - Code)

**Mục đích:** In thống kê cơ bản của fused dataset.

**Output:**
- Shape: (200000, 42)
- Revenue rate: 15.43%
- Missing values: Month_num còn 4642 NaN
- Social signal coverage theo tháng
- Revenue rate theo tháng (Nov cao nhất 24.9%, Feb thấp nhất 1.7%)
- Social mentions by category
- Amazon category performance

---

### Step 8: Visualization - 6 Plots (Cells 8-13 + Markdown Insights)

#### Plot 1: Histogram — Distribution of PageValues

**Loại:** Univariate

**Mã:** `ax.hist(fused_df['PageValues'].clip(upper=quantile(0.95)), bins=40)`

**Ý nghĩa:** PageValues phân phối lệch phải (right-skewed) — hầu hết session có PageValues gần 0, số ít có giá trị cao. Giải thích tại sao PageValues là feature quan trọng nhất và cần log-transform.

---

#### Plot 2: Bar Chart — Revenue Class Distribution

**Loại:** Univariate

**Mã:** `ax.bar(labels, [count_0, count_1])`

**Ý nghĩa:** Class imbalance rõ rệt — 84.6% không mua, 15.4% mua. Giải thích tại sao dùng ROC-AUC thay vì accuracy.

---

#### Plot 3: Scatter — Monthly Sentiment vs Purchase Rate

**Loại:** Bivariate

**Mã:** `ax.scatter(avg_sentiment, purchase_rate, s=total_sessions/30, c=avg_sentiment, cmap='RdYlGn')`

**Ý nghĩa:** Xu hướng dương — tháng có sentiment cao hơn thì purchase rate cao hơn. Đây là bằng chứng cốt lõi cho Q1.

---

#### Plot 4: Box Plot — PageValues by Revenue

**Loại:** Bivariate

**Mã:** `sns.boxplot(data=plot_data, x='Purchase', y='PageValues')`

**Ý nghĩa:** Session mua hàng có median PageValues cao hơn rõ rệt. PageValues là feature mạnh nhất.

---

#### Plot 5: Bar Charts — Twitter Sentiment Distribution

**Loại:** Univariate (bổ sung)

**Mã:** `ax.bar(sent_counts.index, sent_counts.values)` + `ax2.bar(eng_by_sent.index, eng_by_sent.values)`

**Ý nghĩa:** Hầu hết tweet là neutral, nhưng positive tweets có engagement cao hơn hẳn. Giải thích cơ chế Q1 + Q2.

---

#### Plot 6: Scatter — Engagement vs PageValues by Revenue

**Loại:** Bivariate (bổ sung)

**Mã:** `ax.scatter(sub['avg_engagement'], sub['PageValues_clipped'])` với 2 màu cho 2 class

**Ý nghĩa:** Session mua hàng tập trung ở vùng cả PageValues và engagement cao. Chứng minh giá trị của data fusion.

---

### Step 9: ML Models & Research Questions Dashboard (Cells 14-16)

#### Cell 14: Train ML Models

**Feature selection** (8 features):
- `avg_sentiment`, `total_engagement`, `positive_ratio`
- `PageValues`, `BounceRates`, `ProductRelated`
- `sentiment_x_pagevalue`, `engagement_x_product_ratio`

**Model 1 — Logistic Regression:**
```python
lr_model = LogisticRegression(max_iter=1000)
lr_model.fit(X_train, y_train)
lr_proba = lr_model.predict_proba(X_test)[:, 1]
lr_auc = roc_auc_score(y_test, lr_proba)
```
Kết quả: LR AUC = 0.856

**Model 2 — Random Forest:**
```python
rf_model = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42)
rf_model.fit(X_train, y_train)
rf_proba = rf_model.predict_proba(X_test)[:, 1]
rf_auc = roc_auc_score(y_test, rf_proba)
```
Kết quả: RF AUC = 0.942

#### Cell 15: Feature Importance

```python
feature_imp = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values(by='importance', ascending=False)
```

#### Cell 16: Research Questions Dashboard

Vẽ 8 subplots với dark theme:
1. **Q1:** Sentiment vs Purchase Rate (scatter)
2. **Q2:** Engagement Level vs Purchase Rate (bar)
3. **Q3:** Categories mentioned on Twitter (horizontal bar)
4. **Q4:** Purchase Rate by Session Tier (bar)
5. **Q5:** Price Level vs Purchase Probability (bar)
6. **Q6:** ROC Curve (line)
7. **Bonus:** Feature Importance (horizontal bar)
8. **Bonus:** Correlation Heatmap

Lưu file: `output/research_questions_analysis.png`

---

## II. GIẢI THÍCH CHI TIẾT CÂU HỎI 5 & 6

### Câu hỏi 5 (Q5): Does price affect purchasing decisions?

**Cách đo lường:** Không có cột "price" trong dữ liệu eCommerce gốc. Thay vào đó, dùng cross-feature `pagevalue_vs_global_price = PageValues / (global_avg_price + 1)`. Đây là tỷ lệ giữa giá trị session (PageValues — thể hiện giá trị sản phẩm khách hàng xem) và giá trung bình toàn cầu từ Amazon.

**Cách chia nhóm:** Chia `pagevalue_vs_global_price` thành 4 quantiles (Low, Med-Low, Med-High, High) và tính purchase rate trung bình mỗi nhóm.

**Kết quả (non-linear):**
- Low → Med-Low: purchase rate tăng
- Med-Low → Med-High: purchase rate đạt đỉnh
- Med-High → High: purchase rate giảm nhẹ

**Giải thích:**
- Hiệu ứng **non-linear**: Không phải giá càng thấp thì mua càng nhiều
- Người mua có **intent cao** (PageValues cao) sẵn sàng trả giá cao hơn vì đã đầu tư thời gian nghiên cứu
- Giá quá cao tạo friction nhưng chỉ ở extreme
- **Ý nghĩa thực tế:** Chiến lược pricing phân khúc — giảm giá có mục tiêu cho nhóm nhạy giá, không giảm cho nhóm đã có intent cao

**Hạn chế:** Chỉ là proxy (PageValues không phải giá thực tế). Nếu có dữ liệu giá thực tế từ eCommerce, phân tích sẽ chính xác hơn.

---

### Câu hỏi 6 (Q6): Can ML predict purchase using fused data?

**Phương pháp:**
1. Chọn 8 features (kết hợp từ cả 3 nguồn dữ liệu)
2. Train 2 models: Logistic Regression (linear) và Random Forest (non-linear)
3. Đánh giá bằng ROC-AUC

**Kết quả chi tiết:**
- Logistic Regression AUC: **0.856** — học được mối quan hệ tuyến tính
- Random Forest AUC: **0.942** — học được cả interaction phi tuyến
- Baseline ngẫu nhiên: 0.5

**Tại sao Random Forest tốt hơn?**
- RF capture được **non-linear interactions** giữa các features (ví dụ: sentiment × PageValues)
- RF có **feature importance** — cho biết feature nào đóng góp nhiều nhất
- RF handle được class imbalance tốt hơn (thông qua cấu trúc cây)

**Vai trò của Data Fusion trong ML:**
- `sentiment_x_pagevalue`: Chỉ tồn tại nhờ fusion Twitter + eCommerce
- `engagement_x_product_ratio`: Chỉ tồn tại nhờ fusion Twitter + Amazon
- Nếu chỉ dùng eCommerce data, không thể có 2 features này
- Feature importance cho thấy các fused features đóng góp meaningful vào dự đoán

**Ý nghĩa thực tế:**
- Có thể deploy model real-time để score từng session
- Kết hợp cả on-site behavior (PageValues, BounceRates) và social signals (sentiment, engagement)
- Cho phép personalization dựa trên cả hành vi người dùng và bối cảnh social hiện tại

**Giới hạn:**
- Social features chỉ ở mức month-level (do không có user-level key)
- Dataset 200K với 15.4% positive class — vẫn còn imbalance
- Chỉ dùng 8 features, có thể thêm nhiều features hơn để cải thiện

---

## III. TỔNG KẾT PIPELINE

```
Load (3 CSVs, 200K rows each)
  → Clean (fix types, impute, deduplicate)
    → Feature Engineering (engagement, popularity, session features)
      → FUSION PHASE 1: Social × eCommerce (month join)
      → FUSION PHASE 2: Amazon broadcast (global stats)
      → FUSION PHASE 3: Cross-features (interaction terms)
        → EDA (thống kê cơ bản)
          → 6 Plots (univariate + bivariate)
            → ML Models (LR + RF, AUC: 0.856 - 0.942)
              → 6 Research Questions Answered
```

**Sản phẩm đầu ra:**
- `output/final_fused_dataset.csv`: 200,000 × 42
- `output/data_fusion.db`: SQLite database
- `output/social_category_analysis.csv`: Thống kê category từ Twitter
- `output/amazon_category_analysis.csv`: Thống kê category từ Amazon
- `output/research_questions_analysis.png`: Dashboard 8 subplots
- 6 PNG plots riêng lẻ
