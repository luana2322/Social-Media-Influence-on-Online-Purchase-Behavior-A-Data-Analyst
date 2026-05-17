# Giải Thích Chi Tiết `scripts/train_model.py`

## 1. Tổng Quan

| Mục | Chi tiết |
|---|---|
| **Mục đích** | Train **predictive model** (Logistic Regression, Random Forest, XGBoost) từ fused dataset để dự đoán hành vi mua hàng |
| **Đầu vào** | `output/final_fused_dataset.csv` (200,000 dòng, 42 cột) |
| **Đầu ra** | 5 files trong thư mục `models/` |
| **Model tốt nhất** | XGBoost — CV ROC-AUC ≈ **0.961** |

---

## 2. Cấu Trúc File

| Section | Dòng | Chức năng |
|---|---|---|
| Import thư viện | 1-16 | pandas, numpy, sklearn, xgboost, joblib, json |
| Load data | 18-22 | Đọc CSV, in shape + class distribution |
| Feature selection | 24-44 | 10 numerical + 7 categorical features |
| Train/Test split | 46-47 | 80/20 stratified split |
| Preprocessing pipeline | 49-54 | StandardScaler + OneHotEncoder |
| Class imbalance handling | 56-61 | `scale_pos_weight` cho XGBoost |
| 3 models definition | 63-81 | LR, RF, XGBoost trong Pipeline |
| Training loop + CV | 88-151 | 5-Fold Cross-Validation, metrics, chọn best |
| Threshold tuning | 153-180 | Tìm optimal threshold max F1 |
| Save outputs | 182-242 | 1 pickle + 5 JSON files |

---

## 3. Giải Thích Từng Hàm Chi Tiết

### 3.1. Import Thư Viện (dòng 1-16)

```python
import pandas as pd
import numpy as np
import json
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, average_precision_score,
    precision_score, recall_score, confusion_matrix, precision_recall_curve
)
import xgboost as xgb
```

**Giải thích:**
- `pandas`, `numpy`: xử lý dữ liệu dạng bảng và mảng số
- `json`: lưu metadata dạng JSON
- `joblib`: serialize/deserialize model đã train (nhanh hơn pickle)
- `sklearn.model_selection`: chia train/test, cross-validation
- `sklearn.preprocessing`: chuẩn hóa số (StandardScaler), mã hóa category (OneHotEncoder)
- `sklearn.pipeline.Pipeline`: gộp preprocessing + model thành 1 object duy nhất
- `sklearn.compose.ColumnTransformer`: áp dụng preprocessing khác nhau cho từng nhóm cột
- `sklearn.metrics`: các metrics đánh giá (accuracy, F1, ROC-AUC, PR-AUC, precision, recall, confusion matrix)
- `xgboost`: thư viện XGBoost — model mạnh nhất, handle imbalance tốt

---

### 3.2. Load Data (dòng 18-22)

```python
df = pd.read_csv('output/final_fused_dataset.csv')
print(f"Dataset shape: {df.shape}")
print(f"Class distribution:\n{df['Revenue'].value_counts().to_string()}")
```

**Giải thích:**
- Đọc file CSV đã fused (200,000 dòng, 42 cột)
- In shape và phân bố class Revenue (0 = không mua, 1 = mua)
- **Kết quả mẫu:** ~84.6% không mua, ~15.4% mua (imbalance)

---

### 3.3. Feature Selection (dòng 24-44)

```python
numerical_features = ['PageValues', 'BounceRates', 'ExitRates', 'ProductRelated',
                     'Administrative', 'avg_sentiment', 'total_engagement',
                     'positive_ratio', 'engagement_norm', 'global_avg_price']
categorical_features = ['Month', 'OperatingSystems', 'Browser', 'Region',
                       'TrafficType', 'VisitorType', 'Weekend']
```

**10 Numerical features:**

| Feature | Nguồn | Ý nghĩa |
|---|---|---|
| `PageValues` | eCommerce | Giá trị trang đã xem trong session |
| `BounceRates` | eCommerce | Tỷ lệ thoát (0-1) |
| `ExitRates` | eCommerce | Tỷ lệ rời trang |
| `ProductRelated` | eCommerce | Số trang sản phẩm đã xem |
| `Administrative` | eCommerce | Số trang quản trị/giới thiệu |
| `avg_sentiment` | Fusion (Twitter) | Sentiment trung bình tháng |
| `total_engagement` | Fusion (Twitter) | Tổng tương tác Twitter trong tháng |
| `positive_ratio` | Fusion (Twitter) | Tỷ lệ tweet tích cực trong tháng |
| `engagement_norm` | Fusion (Twitter) | Engagement đã chuẩn hóa [0,1] |
| `global_avg_price` | Fusion (Amazon) | Giá trung bình sản phẩm toàn cầu |

**7 Categorical features:**

| Feature | Nguồn | Ý nghĩa |
|---|---|---|
| `Month` | eCommerce | Tháng (Jan-Dec) |
| `OperatingSystems` | eCommerce | Hệ điều hành (1-3) |
| `Browser` | eCommerce | Trình duyệt (1-13) |
| `Region` | eCommerce | Khu vực (1-9) |
| `TrafficType` | eCommerce | Loại traffic (1-20) |
| `VisitorType` | eCommerce | Loại khách (Returning/New/Other) |
| `Weekend` | eCommerce | Cuối tuần (0/1) |

**Verify columns (dòng 33-39):**
```python
missing_cols = [col for col in all_features if col not in df.columns]
```
Kiểm tra cột nào không tồn tại trong DataFrame. Nếu thiếu, tự động loại bỏ khỏi danh sách features — tránh crash.

---

### 3.4. Train/Test Split (dòng 46-47)

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
```

**Giải thích:**
- `test_size=0.2`: 80% train (160K), 20% test (40K)
- `stratify=y`: giữ nguyên tỷ lệ Revenue trong cả train và test — rất quan trọng với data imbalance
- `random_state=42`: seed cố định để tái tạo kết quả

---

### 3.5. Preprocessing Pipeline (dòng 49-54)

```python
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'),
                categorical_features)
    ])
```

**Giải thích:**

**`StandardScaler`** (áp dụng cho numerical features):
- Công thức: `z = (x - mean) / std`
- Biến đổi về phân phối chuẩn (mean=0, std=1)
- Cần thiết cho Logistic Regression và XGBoost

**`OneHotEncoder`** (áp dụng cho categorical features):
- Chuyển mỗi category thành cột binary (0/1)
- `drop='first'`: bỏ cột đầu để tránh đa cộng tuyến (dummy variable trap)
- `sparse_output=False`: trả về dense array (không sparse matrix)
- `handle_unknown='ignore'`: nếu test data có category lạ → đặt all 0 thay vì crash

**`ColumnTransformer`**: cho phép áp dụng 2 tiền xử lý khác nhau trên 2 nhóm cột khác nhau trong cùng 1 object.

---

### 3.6. Class Imbalance Handling (dòng 56-61)

```python
neg_count = (y_train == 0).sum()
pos_count = (y_train == 1).sum()
scale_weight = neg_count / pos_count  # ≈ 5.48
```

**Giải thích:**
- Vì chỉ 15.4% dòng có Revenue=1, model có xu hướng luôn predict 0
- `scale_pos_weight` = số negative / số positive (≈ 5.48)
- XGBoost dùng weight này để phạt nặng hơn khi predict sai class thiểu số (purchase)
- **Công thức:** `loss = weight * loss_positive + loss_negative`

---

### 3.7. 3 Models Definition (dòng 63-81)

```python
models = {
    'Logistic Regression': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(max_iter=1000))
    ]),
    'Random Forest': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ]),
    'XGBoost': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', xgb.XGBClassifier(
            random_state=42,
            eval_metric='logloss',
            scale_pos_weight=scale_weight
        ))
    ])
}
```

**Giải thích từng model:**

**Pipeline:** Gộp preprocessing + classifier thành 1 object. Khi gọi `model.fit(X_train, y_train)`, nó tự động:
1. Transform X_train bằng preprocessor
2. Train classifier trên dữ liệu đã transform

**Logistic Regression:**
- Model tuyến tính: `P(y=1) = 1 / (1 + e^-(b0 + b1*x1 + ... + bn*xn))`
- `max_iter=1000`: số vòng lặp tối đa cho hội tụ (mặc định 100 có thể không đủ)
- **Vai trò:** Baseline — kiểm tra xem features có sức mạnh tuyến tính không

**Random Forest:**
- Ensemble của nhiều decision trees
- `n_estimators=100`: 100 cây
- **Vai trò:** Non-linear model, dễ interpret (feature importance), kiểm tra interaction effects

**XGBoost:**
- Gradient boosting optimized với regularization
- `scale_pos_weight`: xử lý imbalance như mục 3.6
- `eval_metric='logloss'`: metric tối ưu trong training
- **Vai trò:** Model mạnh nhất, dùng cho deployment

---

### 3.8. Training Loop + Cross-Validation (dòng 88-151)

```python
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

**StratifiedKFold:** Chia dữ liệu thành 5 folds, mỗi fold giữ nguyên tỷ lệ Revenue.

**Vòng lặp training:**
```python
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
```

**Tại sao cần Cross-Validation?**
- Tránh overfit: model tốt trên 1 fold nhưng kém trên fold khác
- Đánh giá ổn định: mean ± std của 5 lần đo
- `cross_val_score(model, X, y, cv=cv, scoring='roc_auc')`: tự động chạy 5 lần

**Các metrics được tính:**

| Metric | Công thức | Ý nghĩa |
|---|---|---|
| **Accuracy** | `(TP + TN) / (TP + TN + FP + FN)` | Tỷ lệ dự đoán đúng tổng thể |
| **F1-Score** | `2 * P * R / (P + R)` | Trung bình điều hòa precision & recall |
| **ROC-AUC** | Area under ROC curve | Khả năng phân biệt 2 class (0.5=random, 1=hoàn hảo) |
| **PR-AUC** | Area under Precision-Recall curve | Tốt hơn ROC-AUC khi imbalance |
| **Precision** | `TP / (TP + FP)` | Trong số predict "mua", bao nhiêu % đúng |
| **Recall** | `TP / (TP + FN)` | Trong số thực tế "mua", bắt được bao nhiêu % |
| **Confusion Matrix** | `[[TN, FP], [FN, TP]]` | Ma trận nhầm lẫn |

**Chọn best model:**
```python
if cv_roc_auc.mean() > best_score:
    best_score = cv_roc_auc.mean()
    best_model = model
    best_model_name = name
```
Dựa trên CV ROC-AUC trung bình.

---

### 3.9. Threshold Tuning (dòng 153-180)

```python
precision_vals, recall_vals, thresholds = precision_recall_curve(y_test, y_prob_test)
f1_scores = 2 * (precision_vals * recall_vals) / (precision_vals + recall_vals + 1e-10)
optimal_idx = np.argmax(f1_scores)
optimal_threshold = thresholds[optimal_idx] if optimal_idx < len(thresholds) else 0.5
```

**Giải thích:**
- Mặc định: predict "mua" nếu probability > 0.5
- Nhưng với imbalance, threshold 0.5 không tối ưu
- `precision_recall_curve`: thử tất cả thresholds (từ 0 → 1)
- Với mỗi threshold, tính F1-score
- Chọn threshold cho F1 cao nhất
- **Kết quả:** optimal threshold ≈ 0.78 (cao hơn mặc định)

**So sánh:**

| Threshold | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| 0.5 (default) | 0.896 | 0.616 | 0.867 | 0.720 |
| 0.778 (optimal) | 0.937 | 0.843 | 0.730 | **0.782** |

---

### 3.10. Save Outputs (dòng 182-242)

**`models/model.pkl`** — Pipeline đã train:
```python
joblib.dump(best_model, 'models/model.pkl')
```
- Chứa ColumnTransformer + XGBoost đã fit
- Dùng để load và predict sau này

**`models/features.json`** — Feature schema:
```json
{
  "numerical_features": ["PageValues", "BounceRates", ...],
  "categorical_features": ["Month", "OperatingSystems", ...],
  "target": "Revenue",
  "all_features": ["PageValues", "BounceRates", ..., "Weekend"]
}
```

**`models/metadata.json`** — Metadata đầy đủ:
```json
{
  "model_type": "XGBoost",
  "version": "1.1.0",
  "training_date": "2026-05-15",
  "metrics": {
    "accuracy": 0.896,
    "roc_auc": 0.961,
    "pr_auc": 0.880,
    "cv_roc_auc_mean": 0.961,
    "optimal_threshold": {
      "optimal_threshold": 0.778,
      "optimal_f1": 0.782
    }
  },
  "dataset_version": "final_fused_dataset_v1",
  "features_count": 17,
  "class_imbalance_ratio": 5.48
}
```

**`models/optimal_threshold.json`:**
```json
{
  "optimal_threshold": 0.778,
  "optimal_f1": 0.782,
  "precision_at_optimal": 0.843,
  "recall_at_optimal": 0.730,
  "accuracy_at_optimal": 0.937
}
```

**`models/evaluation_report.json`** — Full report:
- Metrics của cả 3 models (LR, RF, XGBoost)
- Confusion matrix
- So sánh default vs optimal threshold

---

## 4. Kết Quả Mẫu

| Model | CV ROC-AUC | CV F1 | CV PR-AUC |
|---|---|---|---|
| Logistic Regression | ~0.856 | ~0.580 | ~0.720 |
| Random Forest | ~0.942 | ~0.700 | ~0.860 |
| **XGBoost** | **~0.961** | **~0.722** | **~0.878** |

---

## 5. Cách Chạy

```bash
# Từ thư mục gốc /Users/luana/Ki8/DACN/dataAna
python3 scripts/train_model.py
```

Yêu cầu: `output/final_fused_dataset.csv` phải tồn tại.

---

## 6. Flow Tổng Quan

```
output/final_fused_dataset.csv
  → Load data (200K rows, 42 cols)
    → Select 17 features (10 numerical + 7 categorical)
      → Train/Test split (80/20)
        → Preprocessing: StandardScaler + OneHotEncoder
          → Train 3 models: LR, RF, XGBoost
            → 5-Fold Cross-Validation
              → Chọn XGBoost (best CV ROC-AUC)
                → Threshold tuning (optimal ≈ 0.78)
                  → Save: model.pkl + 5 JSON files
```

**Sản phẩm đầu ra:**
- `models/model.pkl`: Pipeline sẵn sàng predict
- `models/features.json`: Feature schema cho API
- `models/metadata.json`: Metrics + version cho monitoring
- `models/optimal_threshold.json`: Threshold cho segment classification
- `models/evaluation_report.json`: Full report cho review
