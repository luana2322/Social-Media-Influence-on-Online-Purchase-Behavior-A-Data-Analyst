# Giải Thích `scripts/train_model.py` — Line by Line

**Tổng số dòng:** 248  
**Mục đích:** Train 3 models (Logistic Regression, Random Forest, XGBoost) trên fused dataset, chọn model tốt nhất, tìm threshold tối ưu, lưu kết quả.

---

## Dòng 1-16: Import thư viện

```python
import pandas as pd                # xử lý dữ liệu dạng bảng (DataFrame)
import numpy as np                 # tính toán số học (mảng, argmax, clip...)
import json                        # ghi file JSON (metadata, features...)
import joblib                      # serialize/deserialize model đã train (nhanh hơn pickle)
from datetime import datetime      # lấy ngày hiện tại cho metadata
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline         # gộp preprocessing + model
from sklearn.compose import ColumnTransformer # áp dụng preprocessing khác nhau cho từng nhóm cột
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, average_precision_score,
    precision_score, recall_score, confusion_matrix, precision_recall_curve
)
import xgboost as xgb              # model XGBoost (mạnh nhất)
```

**Giải thích chi tiết các import sklearn:**
- `train_test_split`: chia dữ liệu thành 2 phần train/test
- `StratifiedKFold`: chia dữ liệu làm 5 folds, giữ nguyên tỷ lệ class
- `cross_val_score`: tự động chạy cross-validation cho 1 metric
- `StandardScaler`: chuẩn hóa về phân phối chuẩn (mean=0, std=1)
- `OneHotEncoder`: chuyển cột category thành mã 0/1
- `ColumnTransformer`: áp dụng StandardScaler cho cột số, OneHotEncoder cho cột category
- `Pipeline`: gộp ColumnTransformer + classifier thành 1 object duy nhất
- `precision_recall_curve`: dùng để tìm threshold tối ưu

---

## Dòng 18-22: Load dữ liệu

```python
print("Loading data...")
df = pd.read_csv('output/final_fused_dataset.csv')
print(f"Dataset shape: {df.shape}")
print(f"Class distribution:\n{df['Revenue'].value_counts().to_string()}")
```

- **Dòng 20:** Đọc file CSV từ thư mục `output/`. File này được tạo bởi notebook (200,000 dòng × 42 cột)
- **Dòng 21:** In shape: `(200000, 42)`
- **Dòng 22:** In số lượng và tỷ lệ Revenue=0 và Revenue=1. Kết quả: ~84.6% không mua, ~15.4% mua.

---

## Dòng 24-44: Feature selection

```python
numerical_features = ['PageValues', 'BounceRates', 'ExitRates', 'ProductRelated',
                     'Administrative', 'avg_sentiment', 'total_engagement',
                     'positive_ratio', 'engagement_norm', 'global_avg_price']
categorical_features = ['Month', 'OperatingSystems', 'Browser', 'Region',
                       'TrafficType', 'VisitorType', 'Weekend']
target = 'Revenue'
```

- **Dòng 25-27:** 10 cột số — 5 từ eCommerce (PageValues, BounceRates, ExitRates, ProductRelated, Administrative) + 4 từ Twitter fusion (avg_sentiment, total_engagement, positive_ratio, engagement_norm) + 1 từ Amazon broadcast (global_avg_price)
- **Dòng 28-29:** 7 cột phân loại — Month, OperatingSystems, Browser, Region, TrafficType, VisitorType, Weekend
- **Dòng 30:** Cột mục tiêu cần dự đoán

```python
all_features = numerical_features + categorical_features
missing_cols = [col for col in all_features if col not in df.columns]
if missing_cols:
    print(f"Warning: Missing columns {missing_cols}")
    numerical_features = [col for col in numerical_features if col in df.columns]
    categorical_features = [col for col in categorical_features if col in df.columns]
    all_features = numerical_features + categorical_features
```

- **Dòng 33:** Gộp 2 danh sách thành 1
- **Dòng 34:** Kiểm tra cột nào không tồn tại trong DataFrame
- **Dòng 35-39:** Nếu có cột thiếu → in warning, tự động loại bỏ khỏi danh sách. Tránh crash khi chạy trên dữ liệu khác.

```python
X = df[all_features]
y = df[target]
```

- **Dòng 43:** Lấy 17 cột làm input features
- **Dòng 44:** Lấy cột Revenue làm target (0/1)

---

## Dòng 46-47: Train/Test split

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
```

- `test_size=0.2`: 80% train (160K), 20% test (40K)
- `stratify=y`: giữ nguyên tỷ lệ Revenue 15.4% ở cả 2 phần
- `random_state=42`: seed cố định để tái tạo kết quả

---

## Dòng 49-54: Preprocessing Pipeline

```python
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'),
                categorical_features)
    ])
```

**`ColumnTransformer`** — cho phép áp dụng 2 transformer khác nhau trên 2 nhóm cột:

**Nhóm 'num'** — `StandardScaler()`:
- Công thức: `z = (x - mean) / std`
- Biến đổi 10 cột số về mean=0, std=1
- Cần thiết cho Logistic Regression và XGBoost

**Nhóm 'cat'** — `OneHotEncoder(...)`:
- `drop='first'`: bỏ cột đầu tiên để tránh đa cộng tuyến
- `sparse_output=False`: trả về dense array (dạng thường), không sparse matrix
- `handle_unknown='ignore'`: nếu test data có category lạ → đặt all 0, không crash

---

## Dòng 56-61: Xử lý class imbalance

```python
neg_count = (y_train == 0).sum()
pos_count = (y_train == 1).sum()
scale_weight = neg_count / pos_count
print(f"\nClass imbalance ratio (neg/pos): {scale_weight:.2f}")
print(f"Negative samples: {neg_count}, Positive samples: {pos_count}")
```

- **Dòng 57-58:** Đếm số lượng negative (0) và positive (1) trong train set
- **Dòng 59:** Tính tỷ lệ neg/pos ≈ 5.48 (cứ 5.48 không mua mới có 1 mua)
- **Dòng 60-61:** In ra console
- `scale_weight` được dùng cho XGBoost (dòng 78) để phạt nặng khi predict sai class thiểu số

---

## Dòng 63-81: Định nghĩa 3 models

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

Mỗi model là 1 **Pipeline** gồm 2 bước:
1. `preprocessor`: ColumnTransformer (StandardScaler + OneHotEncoder)
2. `classifier`: model ML tương ứng

Khi gọi `model.fit(X_train, y_train)`:
- Tự động transform X_train bằng preprocessor
- Train classifier trên dữ liệu đã transform

**Logistic Regression:**
- `max_iter=1000`: số vòng lặp tối đa (mặc định 100 có thể không hội tụ)
- Model tuyến tính, dùng làm baseline

**Random Forest:**
- `n_estimators=100`: 100 cây quyết định
- `random_state=42`: seed cố định

**XGBoost:**
- `eval_metric='logloss'`: metric dùng trong quá trình training
- `scale_pos_weight=scale_weight`: xử lý imbalance (≈ 5.48)
- `random_state=42`: seed cố định

---

## Dòng 83-86: Khởi tạo biến tracking

```python
best_model = None
best_score = 0
results = {}
```

- `best_model`: lưu pipeline của model tốt nhất
- `best_score`: lưu CV ROC-AUC cao nhất
- `results`: dict lưu metrics của cả 3 models

---

## Dòng 88-89: Cross-Validation setup

```python
print("\nTraining models with 5-Fold Cross-Validation...")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

- `n_splits=5`: chia làm 5 phần bằng nhau
- `shuffle=True`: xáo trộn trước khi chia
- `random_state=42`: seed cố định
- **Stratified:** mỗi fold giữ nguyên tỷ lệ Revenue

---

## Dòng 91-151: Vòng lặp training

### Dòng 91-93: Đầu vòng lặp

```python
for name, model in models.items():
    print(f"\n{'='*50}")
    print(f"Training {name}...")
```

Duyệt qua 3 models (LR, RF, XGBoost), in tên model.

### Dòng 96-100: Fit + Predict

```python
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
```

- **Dòng 96:** Train model trên 160K dòng train. Pipeline tự động tiền xử lý rồi mới train.
- **Dòng 99:** Predict nhãn (0/1) trên 40K dòng test
- **Dòng 100:** Predict xác suất class 1 (mua hàng). `[:, 1]` lấy cột thứ 2 của ma trận xác suất.

### Dòng 102-109: Tính metrics trên test set

```python
acc = accuracy_score(y_test, y_pred)           # Accuracy: tỷ lệ dự đoán đúng
f1 = f1_score(y_test, y_pred)                  # F1: trung bình điều hòa precision & recall
roc_auc = roc_auc_score(y_test, y_prob)        # ROC-AUC: khả năng phân biệt 2 class
pr_auc = average_precision_score(y_test, y_prob)  # PR-AUC: precision-recall AUC
precision = precision_score(y_test, y_pred)    # Precision: TP / (TP + FP)
recall = recall_score(y_test, y_pred)          # Recall: TP / (TP + FN)
cm = confusion_matrix(y_test, y_pred).tolist() # Confusion matrix: [[TN,FP],[FN,TP]]
```

### Dòng 112-114: Cross-Validation scores

```python
cv_roc_auc = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
cv_f1 = cross_val_score(model, X, y, cv=cv, scoring='f1')
cv_pr_auc = cross_val_score(model, X, y, cv=cv, scoring='average_precision')
```

- `cross_val_score(model, X, y, cv=cv, scoring='...')`: tự động chạy 5 lần
  - Lần 1: folds 1-4 train, fold 5 test
  - Lần 2: folds 1-3+5 train, fold 4 test
  - ...
- Trả về mảng 5 giá trị → tính mean ± std

**Lưu ý:** Ở đây `cross_val_score` nhận `X, y` (toàn bộ dữ liệu, không phải X_train) — nó tự chia folds bên trong.

### Dòng 117-131: Lưu kết quả

```python
results[name] = {
    'accuracy': float(acc),
    'f1': float(f1),
    'roc_auc': float(roc_auc),
    'pr_auc': float(pr_auc),
    'precision': float(precision),
    'recall': float(recall),
    'confusion_matrix': cm,
    'cv_roc_auc_mean': float(cv_roc_auc.mean()),
    'cv_roc_auc_std': float(cv_roc_auc.std()),
    'cv_f1_mean': float(cv_f1.mean()),
    'cv_f1_std': float(cv_f1.std()),
    'cv_pr_auc_mean': float(cv_pr_auc.mean()),
    'cv_pr_auc_std': float(cv_pr_auc.std())
}
```

Chuyển tất cả sang `float` để dễ dàng serialize sang JSON sau này.

### Dòng 133-146: In kết quả ra console

```python
print(f"  Test Set Metrics:")
print(f"    Accuracy:  {acc:.4f}")
print(f"    F1-Score:  {f1:.4f}")
print(f"    ROC-AUC:   {roc_auc:.4f}")
print(f"    PR-AUC:    {pr_auc:.4f}")
print(f"    Precision: {precision:.4f}")
print(f"    Recall:    {recall:.4f}")
print(f"  Cross-Validation (5-fold):")
print(f"    ROC-AUC:   {cv_roc_auc.mean():.4f} (+/- {cv_roc_auc.std():.4f})")
print(f"    F1-Score:  {cv_f1.mean():.4f} (+/- {cv_f1.std():.4f})")
print(f"    PR-AUC:    {cv_pr_auc.mean():.4f} (+/- {cv_pr_auc.std():.4f})")
print(f"  Confusion Matrix:")
print(f"    TN={cm[0][0]}, FP={cm[0][1]}")
print(f"    FN={cm[1][0]}, TP={cm[1][1]}")
```

### Dòng 148-151: Chọn best model

```python
if cv_roc_auc.mean() > best_score:
    best_score = cv_roc_auc.mean()
    best_model = model
    best_model_name = name
```

- So sánh CV ROC-AUC trung bình
- Model nào có score cao nhất → lưu vào `best_model`, `best_model_name`, `best_score`
- XGBoost thường thắng (CV ROC-AUC ~0.961)

---

## Dòng 153-180: Threshold Tuning

```python
print(f"\n{'='*50}")
print(f"Threshold Tuning for {best_model_name}...")

y_prob_test = best_model.predict_proba(X_test)[:, 1]
```

- **Dòng 157:** Lấy xác suất predict của best model trên test set

```python
precision_vals, recall_vals, thresholds = precision_recall_curve(y_test, y_prob_test)
```

- **Dòng 158:** Tính precision và recall cho mọi threshold từ 0 → 1
- Trả về 3 mảng: precision_vals, recall_vals, thresholds
- `precision_recall_curve` thử tất cả các threshold có thể

```python
f1_scores = 2 * (precision_vals * recall_vals) / (precision_vals + recall_vals + 1e-10)
```

- **Dòng 161:** Tính F1-score cho mỗi threshold
- `+ 1e-10`: tránh chia cho 0

```python
optimal_idx = np.argmax(f1_scores)
optimal_threshold = thresholds[optimal_idx] if optimal_idx < len(thresholds) else 0.5
optimal_f1 = f1_scores[optimal_idx]
```

- **Dòng 162:** Tìm index của F1 cao nhất
- **Dòng 163:** Lấy threshold tương ứng. Nếu index ngoài mảng → fallback 0.5
- **Dòng 164:** Lấy F1 cao nhất

```python
print(f"Default threshold (0.5) F1: {f1_score(y_test, (y_prob_test >= 0.5).astype(int)):.4f}")
print(f"Optimal threshold: {optimal_threshold:.4f}")
print(f"Optimal F1-Score: {optimal_f1:.4f}")
```

- **Dòng 166:** Tính F1 với threshold mặc định 0.5
- **Dòng 167-168:** In threshold tối ưu và F1 tương ứng

```python
y_pred_optimal = (y_prob_test >= optimal_threshold).astype(int)
acc_opt = accuracy_score(y_test, y_pred_optimal)
prec_opt = precision_score(y_test, y_pred_optimal)
rec_opt = recall_score(y_test, y_pred_optimal)
cm_opt = confusion_matrix(y_test, y_pred_optimal).tolist()
```

- **Dòng 171:** Predict lại với threshold tối ưu
- **Dòng 172-175:** Tính accuracy, precision, recall, confusion matrix mới

```python
print(f"Metrics with optimal threshold:")
print(f"  Accuracy:  {acc_opt:.4f}")
print(f"  Precision: {prec_opt:.4f}")
print(f"  Recall:    {rec_opt:.4f}")
```

In kết quả so sánh.

---

## Dòng 182-193: Lưu optimal threshold

```python
threshold_data = {
    'optimal_threshold': float(optimal_threshold),
    'optimal_f1': float(optimal_f1),
    'precision_at_optimal': float(prec_opt),
    'recall_at_optimal': float(rec_opt),
    'accuracy_at_optimal': float(acc_opt),
    'confusion_matrix_optimal': cm_opt
}
with open('models/optimal_threshold.json', 'w') as f:
    json.dump(threshold_data, f, indent=2)
print("Saved: models/optimal_threshold.json")
```

Ghi threshold tối ưu ra file JSON. File này được ML service dùng để phân segment.

---

## Dòng 195-196: Cập nhật best model results

```python
results[best_model_name]['optimal_threshold'] = threshold_data
```

Gắn threshold_data vào kết quả của best model.

---

## Dòng 198-202: Lưu best model

```python
print(f"\n{'='*50}")
print(f"Best model: {best_model_name} (CV ROC-AUC: {best_score:.4f})")
joblib.dump(best_model, 'models/model.pkl')
print("Saved: models/model.pkl")
```

- **Dòng 201:** `joblib.dump()` — serialize toàn bộ Pipeline (bao gồm ColumnTransformer + XGBoost đã train) vào file `.pkl`
- File này được load bởi ML service (FastAPI) khi nhận request predict

---

## Dòng 204-213: Lưu feature schema

```python
feature_schema = {
    'numerical_features': numerical_features,
    'categorical_features': categorical_features,
    'target': target,
    'all_features': all_features
}
with open('models/features.json', 'w') as f:
    json.dump(feature_schema, f, indent=2)
print("Saved: models/features.json")
```

Ghi danh sách features ra JSON. File này được ML service dùng để:
- Biết thứ tự cột khi nhận request
- Validate input features

---

## Dòng 215-231: Lưu metadata

```python
metadata = {
    'model_type': best_model_name,
    'version': '1.1.0',
    'training_date': datetime.now().strftime('%Y-%m-%d'),
    'metrics': results[best_model_name],
    'dataset_version': 'final_fused_dataset_v1',
    'features_count': len(all_features),
    'class_imbalance_ratio': float(scale_weight),
    'cross_validation': {
        'folds': 5,
        'stratified': True
    }
}
with open('models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("Saved: models/metadata.json")
```

Ghi thông tin tổng quan về model:
- `model_type`: XGBoost
- `version`: 1.1.0
- `training_date`: ngày train
- `metrics`: toàn bộ metrics của best model
- `class_imbalance_ratio`: 5.48

---

## Dòng 233-242: Lưu evaluation report

```python
report = {
    'best_model': best_model_name,
    'results': results,
    'selected_metrics': results[best_model_name],
    'optimal_threshold': threshold_data
}
with open('models/evaluation_report.json', 'w') as f:
    json.dump(report, f, indent=2)
print("Saved: models/evaluation_report.json")
```

Ghi báo cáo đầy đủ: kết quả cả 3 models + threshold tối ưu.

---

## Dòng 244-248: Kết thúc

```python
print("\n✅ Model upgrade complete!")
print(f"✅ Added: scale_pos_weight={scale_weight:.2f}")
print(f"✅ Added: 5-Fold Cross-Validation")
print(f"✅ Added: Threshold tuning (optimal={optimal_threshold:.4f})")
print(f"✅ Added: PR-AUC, Precision, Recall, Confusion Matrix")
```

In tóm tắt những gì đã làm.

---

## Tổng kết pipeline

```
output/final_fused_dataset.csv (200K × 42)
  → Chọn 17 features (10 numerical + 7 categorical)
    → Train/Test split 80/20
      → ColumnTransformer: StandardScaler + OneHotEncoder
        → Train 3 models:
            Logistic Regression (baseline)
            Random Forest (100 trees)
            XGBoost (scale_pos_weight=5.48)
          → 5-Fold Cross-Validation (ROC-AUC, F1, PR-AUC)
            → Chọn XGBoost best (CV ROC-AUC ≈ 0.961)
              → Threshold tuning (precision_recall_curve → optimal ≈ 0.78)
                → Save 5 files:
                    models/model.pkl               (Pipeline đã train)
                    models/features.json            (feature schema)
                    models/metadata.json            (metrics + version)
                    models/optimal_threshold.json   (threshold 0.78)
                    models/evaluation_report.json   (full report 3 models)
```

## Output files

| File | Nội dung | Dùng để |
|---|---|---|
| `model.pkl` | Pipeline (ColumnTransformer + XGBoost) | FastAPI predict |
| `features.json` | Danh sách features | Validate input |
| `metadata.json` | Metrics, version, ngày train | Monitoring |
| `optimal_threshold.json` | Threshold 0.78, F1 tối ưu | Segment classification |
| `evaluation_report.json` | Kết quả cả 3 models + threshold | Review/Analysis |
