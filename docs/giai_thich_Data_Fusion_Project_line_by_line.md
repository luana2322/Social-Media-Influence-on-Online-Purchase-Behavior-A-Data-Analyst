# Giải Thích `Data_Fusion_Project.ipynb` — Từng Cell, Từng Dòng

## Tổng Quan

- **Dự án:** Data Fusion — kết hợp 3 dataset thực tế (eCommerce, Twitter, Amazon) phân tích ảnh hưởng mạng xã hội lên hành vi mua hàng
- **File:** `Data_Fusion_Project.ipynb` (25 cells)
- **Tác giả:** Thái Nguyễn Bảo Luân — Nguyễn Hậu — Lưu Hà Nhật Quỳnh
- **Output:** `output/final_fused_dataset.csv` (200K dòng, 42 cột)

---

## Cell 1 — Markdown: Header & Giới thiệu (dòng 4-29)

```markdown
# Fullname: Thái Nguyễn Bảo Luân - Nguyễn Hậu - Lưu Hà Nhật Quỳnh
# ID: 22IT165 - 22IT081 - 22IT245
# Final Project: Data Fusion — Social Media Influence on Online Purchase Behavior
```

Liệt kê 3 dataset gốc:

| Dataset | File | Key Columns |
|---|---|---|
| Online Shoppers (eCommerce) | `online_shoppers.csv` | BounceRates, PageValues, Revenue, Month |
| Twitter Sentiment (Social) | `twitter_sentiment_dataset.csv` | sentiment, sentiment_score, like_count, retweet_count |
| Amazon BR Products | `amz_br_total_products_data_processed.csv` | price, stars, reviews, categoryName |

Chiến lược merge: **Month-based join** (gộp theo tháng) + **global broadcast** (giá trị trung bình toàn cục).

---

## Cell 2 — Markdown: 6 Research Questions (dòng 32-52)

| Câu hỏi | Nội dung |
|---|---|
| Q1 | Twitter sentiment score có tương quan với eCommerce conversion rate không? |
| Q2 | Social media engagement volume ảnh hưởng đến purchase probability? |
| Q3 | Category nào được mention nhiều nhất trên social? So với doanh số Amazon? |
| Q4 | Session value tier (PageValues) dự đoán purchase conversion thế nào? Khác nhau theo visitor segment? |
| Q5 | Relative price perception (PageValues vs global avg price) ảnh hưởng đến purchase probability? |
| Q6 | ML model trên fused data có predictive performance tốt không? Feature fused nào quan trọng? |

---

## Cell 3 — Markdown: Setup & Configuration (dòng 55-60)

Chỉ là tiêu đề cho section setup.

---

## Cell 4 — Code: Import & Config (dòng 63-118)

```python
import pandas as pd
import numpy as np
import sqlite3
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
import warnings
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (classification_report, roc_auc_score,
                             confusion_matrix, roc_curve)
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

warnings.filterwarnings('ignore')
sns.set_theme(style='whitegrid', palette='muted')
plt.rcParams['figure.dpi'] = 120
np.random.seed(42)

SAMPLE_SIZE   = 200_000   # Giới hạn dòng đọc để cân bằng hiệu năng
RANDOM_STATE  = 42
DATA_DIR      = 'dataraw'
OUTPUT_DIR    = 'output'
os.makedirs(OUTPUT_DIR, exist_ok=True)
```

**Giải thích từng import:**
- `pandas`, `numpy`: xử lý dữ liệu dạng bảng và mảng số
- `sqlite3`: lưu kết quả fusion vào database
- `matplotlib`, `seaborn`: vẽ biểu đồ
- `gridspec`: tạo layout lưới cho dashboard nhiều biểu đồ
- `sklearn.*`: ML models, metrics, preprocessing
- `SimpleImputer`, `Pipeline`: tiền xử lý tự động
- `seed(42)`: tái tạo kết quả

**Config:** mỗi dataset đọc tối đa 200K dòng. Tạo thư mục `output/` nếu chưa có.

---

## Cell 5 — Markdown: Load Raw Data (dòng 121-129)

Mô tả: load mỗi file với sample cap 200K.

---

## Cell 6 — Code: Load dữ liệu (dòng 131-199)

```python
# eCommerce — Online Shoppers Behaviour
ecommerce_raw = pd.read_csv(f'{DATA_DIR}/online_shoppers.csv', nrows=SAMPLE_SIZE)
print(f'  eCommerce  : {ecommerce_raw.shape[0]:,} rows × {ecommerce_raw.shape[1]} cols')
# → 200,000 rows × 18 cols

# Social Media — Twitter Sentiment
social_raw = pd.read_csv(f'{DATA_DIR}/twitter_sentiment_dataset.csv', nrows=SAMPLE_SIZE)
print(f'  Social     : {social_raw.shape[0]:,} rows × {social_raw.shape[1]} cols')
# → 200,000 rows × 33 cols

# Product Catalogue — Amazon BR
product_raw = pd.read_csv(f'{DATA_DIR}/amz_br_total_products_data_processed.csv', nrows=SAMPLE_SIZE)
print(f'  Products   : {product_raw.shape[0]:,} rows × {product_raw.shape[1]} cols')
# → 200,000 rows × 11 cols
```

In danh sách columns của từng dataset.

---

## Cell 7 — Markdown: Data Quality Assessment (dòng 201-248)

Chia làm 2 loại vấn đề:

### (A) Content Issues

| Dataset | Issue | Fix |
|---|---|---|
| eCommerce | NaN BounceRates/ExitRates/PageValues | Impute median |
| eCommerce | Revenue là string 'True'/'False' | Map → 0/1 |
| eCommerce | Weekends là boolean string | Map → int |
| eCommerce | Duration âm | Clip lower=0 |
| Social | like_count/retweet_count NaN | Fill 0 |
| Social | sentiment_score ngoài [-1,1] | Clip |
| Social | created_at lỗi datetime | pd.to_datetime(coerce) |
| Product | stars/reviews/boughtInLastMonth NaN | Impute median/0 |
| Product | price ≤ 0 | Xóa dòng |
| Product | isBestSeller string | Map → binary |

### (B) Structural Issues

| Dataset | Issue | Fix |
|---|---|---|
| eCommerce | Month string → không so sánh được | Map → integer 1-12 |
| eCommerce | VisitorType free-text | Encode is_returning flag |
| Social | Unnamed columns artifact | Drop |
| Social | Duplicate tweet id | Deduplicate |
| Social | sentiment mixed case | Lowercase + strip |
| Product | Duplicate asin | Deduplicate |
| Product | categoryName là raw Portuguese free-text | Parse → broad_category (8 nhóm) |
| All | No shared primary key | Fusion: Month join + broadcast |

---

## Cell 8 — Code: Data Cleaning (dòng 250-423)

### `clean_ecommerce(df)` (dòng 287-321)

```python
def clean_ecommerce(df):
    d = df.copy()

    # Fix boolean target
    d['Revenue'] = d['Revenue'].astype(str).str.strip().map({'True': 1, 'False': 0})
    d = d.dropna(subset=['Revenue'])
    d['Revenue'] = d['Revenue'].astype(int)
```
Dòng 292: chuyển 'True'/'False' → 1/0. Dòng 293: xóa NaN. Dòng 294: cast int.

```python
    d['Weekend'] = d['Weekend'].astype(str).str.strip().map({'True': 1, 'False': 0}).fillna(0)
```
Dòng 297: chuyển Weekend flag.

```python
    num_cols = ['Administrative', 'Administrative_Duration', 'Informational',
                'Informational_Duration', 'ProductRelated', 'ProductRelated_Duration',
                'BounceRates', 'ExitRates', 'PageValues', 'SpecialDay']
    for c in num_cols:
        if c in d.columns:
            d[c] = pd.to_numeric(d[c], errors='coerce')
            d[c] = d[c].fillna(d[c].median())
```
Dòng 300-306: cast numeric, fillna median cho 10 cột số.

```python
    for c in ['Administrative_Duration', 'Informational_Duration', 'ProductRelated_Duration']:
        if c in d.columns:
            d[c] = d[c].clip(lower=0)
```
Dòng 308-310: xóa duration âm.

```python
    month_map = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,
                 'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
    d['Month_num'] = d['Month'].map(month_map)
```
Dòng 314-316: map Month string → integer.

```python
    d['is_returning'] = (d['VisitorType'] == 'Returning_Visitor').astype(int)
```
Dòng 319: encode visitor type thành binary.

### `clean_social(df)` (dòng 327-356)

```python
def clean_social(df):
    d = df.copy()
    d = d.drop(columns=[c for c in d.columns if c.startswith('Unnamed')], errors='ignore')
```
Dòng 332: xóa artifact columns.

```python
    id_col = 'id' if 'id' in d.columns else None
    d = d.drop_duplicates(subset=[id_col] if id_col else None)
```
Dòng 335-336: xóa tweet trùng lặp.

```python
    d['created_at'] = pd.to_datetime(d['created_at'], errors='coerce')
    d['Month_num'] = d['created_at'].dt.month
```
Dòng 339-340: parse datetime → lấy tháng.

```python
    d['sentiment'] = d['sentiment'].astype(str).str.lower().str.strip()
    d['sentiment'] = d['sentiment'].where(
        d['sentiment'].isin(['positive', 'negative', 'neutral']), 'neutral'
    )
```
Dòng 343-346: chuẩn hóa sentiment label (lowercase, unknown → 'neutral').

```python
    d['sentiment_score'] = pd.to_numeric(d['sentiment_score'], errors='coerce').fillna(0).clip(-1, 1)
```
Dòng 349: giới hạn sentiment_score trong [-1, 1].

```python
    for c in ['like_count', 'retweet_count', 'reply_count', 'impression_count']:
        if c in d.columns:
            d[c] = pd.to_numeric(d[c], errors='coerce').fillna(0).clip(0)
```
Dòng 352-354: fill 0 cho engagement metrics, clip ≥ 0.

### `CATEGORY_KEYWORDS` (dòng 362-371)

```python
CATEGORY_KEYWORDS = {
    'Electronics': ['eletr','tv','celular','computador','câmera','tablet','video','áudio','som','fone'],
    'Gaming':      ['game','jogo','console','playstation','xbox','nintendo'],
    'Sports':      ['esporte','fitness','treino','musculação','bicicleta'],
    'Clothing':    ['moda','roupa','tênis','sapato','vestuário','calçado'],
    'Beauty':      ['beleza','cosmétic','perfume','cabelo','skincare'],
    'Home':        ['casa','cozinha','móvel','decoração','jardim','ferrament'],
    'Books':       ['livro','literatura','educação'],
    'Baby':        ['bebê','infantil','brinquedo','criança'],
}
```
8 nhóm sản phẩm với từ khóa tiếng Bồ Đào Nha.

### `map_category(cat_str)` (dòng 373-380)

```python
def map_category(cat_str):
    if pd.isna(cat_str):
        return 'Other'
    c = cat_str.lower()
    for broad, kws in CATEGORY_KEYWORDS.items():
        if any(k in c for k in kws):
            return broad
    return 'Other'
```
Duyệt từng nhóm, nếu category name chứa keyword → trả về nhóm đó. Không khớp → 'Other'.

### `clean_product(df)` (dòng 382-409)

```python
def clean_product(df):
    d = df.copy()
    for c in ['price', 'listPrice', 'stars', 'reviews', 'boughtInLastMonth']:
        d[c] = pd.to_numeric(d[c], errors='coerce')
```
Dòng 386-387: cast numeric 5 cột.

```python
    d = d[d['price'] > 0].copy()
```
Dòng 390: xóa sản phẩm có price ≤ 0.

```python
    d = d.drop_duplicates(subset=['asin'])
```
Dòng 393: xóa sản phẩm trùng asin.

```python
    d['price']              = d['price'].fillna(d['price'].median())
    d['stars']              = d['stars'].fillna(d['stars'].median())
    d['reviews']            = d['reviews'].fillna(0)
    d['boughtInLastMonth']  = d['boughtInLastMonth'].fillna(0)
    d['listPrice']          = d['listPrice'].fillna(0)
```
Dòng 396-400: điền giá trị thiếu — price/stars dùng median, reviews/sales/listPrice fill 0.

```python
    d['broad_category'] = d['categoryName'].apply(map_category)
```
Dòng 403: parse categoryName → broad_category.

```python
    d['isBestSeller'] = d['isBestSeller'].astype(str).map({'True':1,'False':0}).fillna(0)
```
Dòng 406: chuyển isBestSeller thành binary.

### Execute Cleaning (dòng 412-421)

```python
ecommerce_clean = clean_ecommerce(ecommerce_raw)
social_clean    = clean_social(social_raw)
product_clean   = clean_product(product_raw)
```
Áp dụng 3 hàm clean. In kết quả:
- eCommerce: (200000, 20), Revenue rate 15.43%
- Social: (200000, 34), neutral=101693, positive=81082, negative=17225
- Product: (156669, 12)

---

## Cell 9 — Markdown: Feature Engineering (dòng 425-436)

---

## Cell 10 — Code: Feature Engineering (dòng 438-651)

### `TWEET_KEYWORDS` (dòng 581-598)

```python
TWEET_KEYWORDS = {
    'Electronics': ['phone','laptop','camera','tech','gadget','device','electronic','tv','tablet','smartphone'],
    'Gaming':      ['game','gaming','console','playstation','xbox','nintendo','esport'],
    'Sports':      ['sport','fitness','gym','workout','exercise','running','training'],
    'Clothing':    ['fashion','clothes','wear','style','outfit','shirt','dress','shoe'],
    'Beauty':      ['beauty','makeup','cosmetic','skincare','hair','perfume','lipstick'],
    'Home':        ['home','house','decor','furniture','kitchen','interior','garden'],
    'Books':       ['book','read','novel','author','literature','kindle'],
}
```
Từ khóa tiếng Anh để classify tweet content vào category.

### `classify_tweet(text)` (dòng 591-598)

```python
def classify_tweet(text):
    if pd.isna(text):
        return 'Other'
    t = str(text).lower()
    for cat, kws in TWEET_KEYWORDS.items():
        if any(k in t for k in kws):
            return cat
    return 'Other'
```
Giống `map_category()` nhưng cho tweet text.

### `engineer_social(df)` (dòng 600-609)

```python
def engineer_social(df):
    d = df.copy()
    reply = d['reply_count'] if 'reply_count' in d.columns else 0
    d['engagement']     = d['like_count'] + d['retweet_count'] + reply
```
Dòng 603-604: tổng tương tác = likes + retweets + replies.

```python
    d['sentiment_norm'] = (d['sentiment_score'] + 1) / 2
```
Dòng 606: chuẩn hóa sentiment_score từ [-1,1] → [0,1].

```python
    d['tweet_category'] = d['text'].apply(classify_tweet)
```
Dòng 608: classify tweet vào category.

### `engineer_product(df)` (dòng 613-624)

```python
def engineer_product(df):
    d = df.copy()
    d['popularity_score'] = d['stars'] * np.log1p(d['reviews'])
```
Dòng 615: popularity = stars × log(reviews + 1). Dùng log để giảm skew.

```python
    d['discount_ratio']   = np.where(
        d['listPrice'] > 0,
        ((d['listPrice'] - d['price']) / d['listPrice']).clip(0, 1),
        0
    )
```
Dòng 616-619: tỷ lệ giảm giá = (listPrice - price) / listPrice, giới hạn [0, 1].

```python
    d['price_tier'] = pd.qcut(d['price'], q=4,
                               labels=['Low','Med-Low','Med-High','High'],
                               duplicates='drop')
```
Dòng 621-623: chia 4 nhóm giá.

### `engineer_ecommerce(df)` (dòng 628-637)

```python
def engineer_ecommerce(df):
    d = df.copy()
    d['total_pages']         = d['Administrative'] + d['Informational'] + d['ProductRelated']
```
Dòng 630: tổng số trang đã xem trong session.

```python
    d['product_page_ratio']  = np.where(d['total_pages'] > 0,
                                         d['ProductRelated'] / d['total_pages'], 0)
```
Dòng 631-632: tỷ lệ trang sản phẩm / tổng trang.

```python
    d['session_intensity']   = d['total_pages'] * (1 - d['BounceRates'])
```
Dòng 633: cường độ session = số trang × (1 - bounce rate).

```python
    for col in ['ProductRelated_Duration', 'Administrative_Duration', 'PageValues']:
        if col in d.columns:
            d[f'log_{col}'] = np.log1p(d[col])
```
Dòng 634-636: log-transform 3 cột skewed.

---

## Cell 11 — Markdown: Data Fusion Strategy (dòng 654-669)

| Phase | Datasets Joined | Key | Type |
|---|---|---|---|
| 1 | Twitter × eCommerce | `Month_num` | LEFT JOIN (month-level aggregation) |
| 2 | Amazon → fused | — | BROADCAST (scalar constants per session) |
| 3 | Cross-features | Derived | Multiply signals across sources |

---

## Cell 12 — Code: Data Fusion (dòng 672-952)

### PHASE 1: `fuse_social_ecommerce()` (dòng 843-872)

```python
monthly_agg = soc_df.groupby('Month_num').agg(
    avg_sentiment      = ('sentiment_score', 'mean'),
    total_engagement   = ('engagement', 'sum'),
    mention_count      = ('id', 'count'),
    positive_ratio     = ('sentiment', lambda x: (x == 'positive').mean()),
    negative_ratio     = ('sentiment', lambda x: (x == 'negative').mean()),
    avg_engagement     = ('engagement', 'mean'),
).reset_index()
```
Dòng 845-852: gộp Twitter theo tháng → 7 cột aggregate.

```python
max_eng = monthly_agg['total_engagement'].max()
monthly_agg['engagement_norm'] = monthly_agg['total_engagement'] / max_eng if max_eng > 0 else 0
```
Dòng 855-856: chuẩn hóa engagement về [0, 1].

```python
fused = ecom_df.merge(monthly_agg, on='Month_num', how='left')
```
Dòng 861: LEFT JOIN eCommerce với monthly aggregates — mỗi session được gắn sentiment của tháng đó.

```python
fused['avg_sentiment']    = fused['avg_sentiment'].fillna(0)
fused['total_engagement'] = fused['total_engagement'].fillna(0)
fused['mention_count']    = fused['mention_count'].fillna(0)
fused['positive_ratio']   = fused['positive_ratio'].fillna(0.33)
fused['negative_ratio']   = fused['negative_ratio'].fillna(0.33)
fused['engagement_norm']  = fused['engagement_norm'].fillna(0)
fused['avg_engagement']   = fused['avg_engagement'].fillna(0)
```
Dòng 864-870: tháng không có Twitter coverage → fill baseline (sentiment=0, positive_ratio=0.33).

### PHASE 2: `fuse_product_broadcast()` (dòng 878-893)

```python
stats = {
    'global_avg_price'       : prod_df['price'].mean(),
    'global_median_price'    : prod_df['price'].median(),
    'global_avg_stars'       : prod_df['stars'].mean(),
    'global_avg_popularity'  : prod_df['popularity_score'].mean(),
    'global_bestseller_ratio': prod_df['isBestSeller'].mean(),
    'global_avg_discount'    : prod_df['discount_ratio'].mean(),
}
```
Dòng 880-886: tính 6 thống kê toàn cục từ Amazon.

```python
for k, v in stats.items():
    fused_df[k] = v
```
Dòng 891-892: broadcast — gán cùng 6 giá trị này vào **mọi dòng** trong fused dataset.

### PHASE 3: Cross-features (dòng 941-943)

```python
fused_df['sentiment_x_pagevalue']       = fused_df['avg_sentiment'] * fused_df['PageValues']
```
Tương tác sentiment × giá trị session.

```python
fused_df['engagement_x_product_ratio']  = fused_df['engagement_norm'] * fused_df['product_page_ratio']
```
Tương tác engagement × tỷ lệ trang sản phẩm.

```python
fused_df['pagevalue_vs_global_price']   = fused_df['PageValues'] / (fused_df['global_avg_price'] + 1)
```
Cảm nhận giá: PageValues so với giá trung bình Amazon.

### `build_category_frames()` (dòng 899-930)

```python
soc_cats = soc_df[soc_df['tweet_category'] != 'Other'].groupby('tweet_category').agg(
    mention_count  = ('id', 'count'),
    avg_sentiment  = ('sentiment_score', 'mean'),
    total_engage   = ('engagement', 'sum'),
    positive_ratio = ('sentiment', lambda x: (x == 'positive').mean())
).reset_index().sort_values('mention_count', ascending=False)
```
Dòng 902-913: số liệu Twitter theo category.

```python
amz_cats = prod_df[prod_df['broad_category'] != 'Other'].groupby('broad_category').agg(
    product_count  = ('asin', 'count'),
    avg_price      = ('price', 'mean'),
    avg_stars      = ('stars', 'mean'),
    total_sales    = ('boughtInLastMonth', 'sum'),
    avg_popularity = ('popularity_score', 'mean')
).reset_index().sort_values('total_sales', ascending=False)
```
Dòng 916-928: số liệu Amazon theo category.

Kết quả: fused dataset (200,000, 42), Revenue rate 15.43%.

---

## Cell 13 — Code: Save Output (dòng 955-1005)

```python
fused_df.to_csv(f'{OUTPUT_DIR}/final_fused_dataset.csv', index=False)
```
Lưu CSV: 200K dòng × 42 cột.

```python
def store_to_sqlite(df, db_path):
    conn = sqlite3.connect(db_path)
    df.to_sql('fused_dataset', conn, if_exists='replace', index=False)
    conn.close()
```
Lưu SQLite: `data_fusion.db`, table `fused_dataset`.

```python
social_cats.to_csv(f'{OUTPUT_DIR}/social_category_analysis.csv', index=False)
amazon_cats.to_csv(f'{OUTPUT_DIR}/amazon_category_analysis.csv', index=False)
```
Lưu category frames riêng.

---

## Cell 14 — Markdown: EDA Overview (dòng 1008-1016)

---

## Cell 15 — Code: EDA (dòng 1017-1099)

```python
print('=== FUSED DATASET — EDA OVERVIEW ===')
print(f'Shape: {fused_df.shape}')                     # (200000, 42)
print(f'Revenue (purchase) rate: {fused_df["Revenue"].mean():.2%}')  # 15.43%
print(f'Missing values:\n{fused_df.isnull().sum()[fused_df.isnull().sum()>0].to_string()}')
# Chỉ Month_num: 4642 missing
```

```python
print(fused_df.groupby("Month")[['avg_sentiment','total_engagement','positive_ratio']].mean().to_string())
```
Social signal coverage theo tháng. Jul, June, May = 0 (không có Twitter data).

```python
print(fused_df.groupby('Month')['Revenue'].mean().sort_values(ascending=False).to_string())
```
Revenue by Month: Nov (24.9%) > Oct (21.3%) > Sep (18.9%) > ... > Feb (1.7%).

```python
print(social_cats.to_string(index=False))
```
Social mentions: Books (8245) > Electronics (6840) > Home (5945) > ...

```python
print(amazon_cats.to_string(index=False))
```
Amazon performance: Electronics (20849 products, avg_price 384, total_sales 90350) > ...

---

## Cell 16 — Markdown: Bivariate Analysis (dòng 1102-1112)

---

## Cell 17 — Code: Plot 3 — Sentiment vs Purchase Rate (dòng 1116-1186)

```python
monthly_summary = fused_df.groupby('Month_num').agg(
    avg_sentiment  = ('avg_sentiment',  'first'),
    purchase_rate  = ('Revenue',        'mean'),
    total_sessions = ('Revenue',        'count')
).reset_index().dropna()
```
Tính avg_sentiment + purchase_rate theo tháng.

```python
fig, ax = plt.subplots(figsize=(9, 6))

sc = ax.scatter(
    monthly_summary['avg_sentiment'],
    monthly_summary['purchase_rate'],
    s=monthly_summary['total_sessions'] / 30,  # bubble size
    c=monthly_summary['avg_sentiment'],
    cmap='RdYlGn', edgecolors='grey', linewidths=0.6,
    alpha=0.90, zorder=5
)
```
Scatter plot: X=sentiment, Y=purchase_rate, size=số sessions, color=sentiment level.

```python
month_names = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',
               7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}
for _, row in monthly_summary.iterrows():
    ax.annotate(month_names.get(int(row['Month_num']), ''),
                (row['avg_sentiment'], row['purchase_rate']),
                textcoords='offset points', xytext=(6, 4), fontsize=9)
```
Gắn nhãn tháng cho mỗi điểm.

```python
if len(monthly_summary) > 2:
    z = np.polyfit(monthly_summary['avg_sentiment'],
                   monthly_summary['purchase_rate'], 1)
    xs = np.linspace(monthly_summary['avg_sentiment'].min(),
                     monthly_summary['avg_sentiment'].max(), 50)
    ax.plot(xs, np.poly1d(z)(xs), 'k--', linewidth=1.5, label='Linear trend')
    ax.legend(fontsize=9)
```
Đường trend linear → kiểm tra xu hướng dương.

```python
ax.set_title('Plot 3 — Monthly Social Sentiment vs Purchase Rate\n'
             '(Bubble size ∝ number of sessions; colour = sentiment level)',
             fontsize=12, fontweight='bold', pad=12)
ax.set_xlabel('Avg Monthly Sentiment Score (from Twitter)', fontsize=11)
ax.set_ylabel('Monthly Purchase Rate (Revenue=1)', fontsize=11)
```
Labels.

---

## Cell 18 — Markdown: Insight Plot 3 (dòng 1189-1196)

```markdown
Months with higher Twitter sentiment show higher purchase conversion rates — a positive trend
only discoverable through data fusion.
```
Insight: Sentiment cao → purchase rate cao.

---

## Cell 19 — Code: Plot 4 — PageValues by Revenue (dòng 1199-1257)

```python
fig, ax = plt.subplots(figsize=(9, 6))

plot_data = fused_df[['Revenue', 'PageValues']].copy()
clip_val   = plot_data['PageValues'].quantile(0.99)
plot_data['PageValues'] = plot_data['PageValues'].clip(upper=clip_val)
```
Clip 99th percentile để loại outlier cực đoan.

```python
plot_data['Purchase'] = plot_data['Revenue'].map({0: 'No Purchase (0)', 1: 'Purchase (1)'})

sns.boxplot(
    data=plot_data, x='Purchase', y='PageValues',
    palette={'No Purchase (0)': '#DD8452', 'Purchase (1)': '#4C72B0'},
    width=0.45, linewidth=1.4,
    order=['No Purchase (0)', 'Purchase (1)'],
    ax=ax
)
```
Boxplot so sánh PageValues giữa 2 nhóm.

```python
for i, grp in enumerate(['No Purchase (0)', 'Purchase (1)']):
    rev_val = 0 if grp.startswith('No') else 1
    med = plot_data[plot_data['Revenue'] == rev_val]['PageValues'].median()
    ax.text(i, med + clip_val * 0.02, f'Median\n{med:.1f}',
            ha='center', fontsize=9, fontweight='bold', color='black')
```
Overlay median label.

```python
ax.set_title('Plot 4 — PageValues Distribution by Purchase Outcome\n'
             '(clipped at 99th percentile; outliers shown as points)',
             fontsize=12, fontweight='bold', pad=12)
```

---

## Cell 20 — Markdown: Insight Plot 4 (dòng 1259-1267)

```markdown
Purchasing sessions have significantly higher median PageValues than non-purchasing ones —
the strongest separation of any single feature.
```
Insight: PageValues là feature mạnh nhất.

---

## Cell 21 — Markdown: Dashboard (dòng 1269-1277)

---

## Cell 22 — Code: Train ML Models (dòng 1279-1342)

```python
features = [
    'avg_sentiment', 'total_engagement', 'positive_ratio',
    'PageValues', 'BounceRates', 'ProductRelated',
    'sentiment_x_pagevalue', 'engagement_x_product_ratio'
]
```
8 features: 3 social + 3 eCommerce + 2 cross-features fusion.

```python
X = fused_df[features].fillna(0)
y = fused_df['Revenue']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```
Chia 80/20, stratify giữ tỷ lệ Revenue.

### Logistic Regression (dòng 1324-1328)

```python
lr_model = LogisticRegression(max_iter=1000)
lr_model.fit(X_train, y_train)
lr_proba = lr_model.predict_proba(X_test)[:, 1]
lr_auc = roc_auc_score(y_test, lr_proba)
```
LR AUC = 0.856.

### Random Forest (dòng 1331-1341)

```python
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42
)
rf_model.fit(X_train, y_train)
rf_proba = rf_model.predict_proba(X_test)[:, 1]
rf_auc = roc_auc_score(y_test, rf_proba)
```
RF AUC = 0.942.

---

## Cell 23 — Code: Feature Importance (dòng 1345-1365)

```python
feature_imp = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values(by='importance', ascending=False)

feature_imp.reset_index(drop=True, inplace=True)
```
Xếp hạng feature importance từ Random Forest.

---

## Cell 24 — Code: Dashboard 6-panel + Bonus (dòng 1367-1574)

```python
fig = plt.figure(figsize=(20, 28))
fig.patch.set_facecolor('#0f1117')
```
Figure nền tối.

```python
gs = gridspec.GridSpec(4, 2, figure=fig, hspace=0.5, wspace=0.35)
```
Layout 4 hàng × 2 cột.

### Hàm `style_ax()` (dòng 1411-1419)

```python
def style_ax(ax, title, xlabel, ylabel):
    ax.set_facecolor(DARK_BG)                    # nền tối
    ax.set_title(title, color=TEXT_CLR, fontweight='bold', fontsize=11, pad=10)
    ax.set_xlabel(xlabel, color=TEXT_CLR, fontsize=9)
    ax.set_ylabel(ylabel, color=TEXT_CLR, fontsize=9)
    ax.tick_params(colors=TEXT_CLR)              # text sáng
    for spine in ax.spines.values():
        spine.set_edgecolor('#333344')           # spine xám
```

### Q1: Sentiment vs Purchase (dòng 1422-1441)

```python
ax1 = fig.add_subplot(gs[0, 0])
q1 = fused_df.groupby('Month_num').agg(
    avg_sentiment=('avg_sentiment','first'),
    purchase_rate=('Revenue','mean')
).reset_index().dropna()
sc1 = ax1.scatter(q1['avg_sentiment'], q1['purchase_rate'],
                   c=q1['avg_sentiment'], cmap='RdYlGn',
                   s=150, edgecolors='white', linewidths=0.8, zorder=5)
```
Scatter plot: sentiment × purchase rate, 1 điểm/tháng.

```python
if len(q1) > 2:
    z = np.polyfit(q1['avg_sentiment'], q1['purchase_rate'], 1)
    p = np.poly1d(z)
    xs = np.linspace(q1['avg_sentiment'].min(), q1['avg_sentiment'].max(), 50)
    ax1.plot(xs, p(xs), '--', color='#FFD700', linewidth=1.5, label='Trend')
    ax1.legend(fontsize=8, facecolor=DARK_BG, labelcolor=TEXT_CLR)
```
Đường trend vàng.

### Q2: Engagement vs Purchase (dòng 1443-1461)

```python
enc_bins = pd.qcut(fused_df['total_engagement'], q=4,
                    labels=['Low','Med-Low','Med-High','High'], duplicates='drop')
q2 = fused_df.groupby(enc_bins)['Revenue'].mean().reset_index()
```
Chia engagement thành 4 quartile. Bar chart: quartile × purchase rate.

### Q3: Categories on Twitter (dòng 1463-1476)

```python
sc3 = social_cats.head(8)
bars3 = ax3.barh(sc3['tweet_category'][::-1], sc3['mention_count'][::-1],
                  color=colors3[::-1], edgecolor='#aaaaaa', linewidth=0.5)
```
Bar chart ngang: top categories theo số mention.

### Q4: Session Tier vs Purchase (dòng 1478-1501)

```python
fused_df['session_tier'] = pd.qcut(
    fused_df['PageValues'], q=5,
    labels=['Basic','Low','Mid','High','Premium'],
    duplicates='drop'
)
q4 = fused_df.groupby('session_tier')['Revenue'].mean().reset_index().dropna()
```
Chia PageValues thành 5 tiers. Bar chart: tier × purchase rate.

### Q5: Price vs Purchase (dòng 1503-1526)

```python
fused_df['price_proxy_tier'] = pd.qcut(
    fused_df['pagevalue_vs_global_price'], q=4,
    labels=['Low','Med-Low','Med-High','High'],
    duplicates='drop'
)
q5 = fused_df.groupby('price_proxy_tier')['Revenue'].mean().reset_index().dropna()
```
Chia price proxy (PageValues / global avg price) thành 4 tiers.

### Q6: ROC Curve (dòng 1528-1542)

```python
lr_fpr, lr_tpr, _ = roc_curve(y_test, lr_proba)
rf_fpr, rf_tpr, _ = roc_curve(y_test, rf_proba)
ax6.plot(lr_fpr, lr_tpr, color='#00BFFF', lw=2,
          label=f'Logistic Regression  (AUC = {lr_auc:.3f})')
ax6.plot(rf_fpr, rf_tpr, color='#32CD32', lw=2,
          label=f'Random Forest        (AUC = {rf_auc:.3f})')
ax6.plot([0,1],[0,1],'--', color='#888888', lw=1, label='Random Baseline')
```
ROC curve: LR (blue) và RF (green) vs random baseline.

### Bonus: Feature Importance (dòng 1544-1552)

```python
top12 = feature_imp.head(12)
ax7.barh(top12['feature'][::-1], top12['importance'][::-1],
          color=colors7[::-1], edgecolor='#aaaaaa', linewidth=0.5)
```
Top 12 features theo Gini importance.

### Bonus: Correlation Heatmap (dòng 1554-1568)

```python
corr_cols = ['Revenue', 'avg_sentiment', 'total_engagement', 'positive_ratio',
              'PageValues', 'BounceRates', 'ProductRelated',
              'sentiment_x_pagevalue', 'engagement_x_product_ratio']
corr_matrix = fused_df[corr_cols].corr()
sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='RdBu_r',
             ax=ax8, vmin=-1, vmax=1, annot_kws={'size': 7}, cbar_kws={'shrink': 0.7})
```
Heatmap tương quan 9 cột chính.

```python
plt.savefig(f'{OUTPUT_DIR}/research_questions_analysis.png',
             dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
```
Lưu dashboard.

---

## Cell 25 — Markdown: 6 Answers (dòng 1576-1739)

**❶ Q1:** Sentiment tích cực → purchase rate cao hơn. Evidence từ scatter plot + feature importance.

**❷ Q2:** Engagement cao → purchase rate cao. Evidence từ bar chart Q2 + cross-feature importance.

**❸ Q3:** Electronics được mention nhiều nhất. So với Amazon: Electronics cũng top doanh số.

**❹ Q4:** Premium tier (PageValues cao nhất) có conversion rate cao gấp nhiều lần Basic. PageValues là feature #1.

**❺ Q5:** Med-High tier có purchase rate cao nhất, High giảm nhẹ → phi tuyến. Giá là rào cản nhưng không tuyệt đối.

**❻ Q6:** RF AUC=0.942 > LR AUC=0.856. Cross-features fusion (sentiment_x_pagevalue) nằm trong top predictors.

---

## Cell 26 — Markdown: Reflection (dòng 1741-1777)

### Summary
Fusion 3 dataset → 200K × 42. RF AUC **0.942**. Cross-features chứng minh giá trị của data fusion.

### Limitations
1. Month-level fusion → correlation, không causation
2. Chỉ Twitter, không đại diện toàn bộ social
3. PageValues là proxy, không phải giá thật
4. Class imbalance 15.4%
5. Thiếu Twitter coverage vài tháng → fill baseline

### Future Work
- User-level fusion với shared identifier
- Weekly/daily alignment
- Multi-platform (Instagram, TikTok)
- Real-time ML deployment (FastAPI port 8000)
- A/B testing

---

## Tổng kết pipeline

```
dataraw/online_shoppers.csv          (200K × 18)
dataraw/twitter_sentiment_dataset.csv (200K × 33)
dataraw/amz_br_total_products_data_processed.csv (200K × 11)
  → Clean (fix types, impute, deduplicate)
    → Feature Engineering (engagement, popularity, log-transform, etc.)
      → FUSION PHASE 1: Twitter by Month → LEFT JOIN eCommerce
      → FUSION PHASE 2: Amazon global stats → BROADCAST
      → FUSION PHASE 3: Cross-features (sentiment × PageValues, etc.)
        → EDA + Plot 3 (Sentiment vs Purchase Rate)
        → EDA + Plot 4 (PageValues by Revenue)
          → ML: LR (AUC 0.856), RF (AUC 0.942)
            → Dashboard: Q1-Q6 + Feature Importance + Correlation Heatmap
              → output/final_fused_dataset.csv (200K × 42)
```
