# Giải Thích `scripts/train_model.py` — Đơn Giản

## Mục đích

Học từ dữ liệu 200,000 khách hàng để dự đoán: **người này có mua hàng không?**

## Quy trình từng bước

### 1. Đọc dữ liệu
- File: `output/final_fused_dataset.csv` (200K dòng, 42 cột)
- Cột cần dự đoán: **Revenue** (1 = mua, 0 = không mua)
- Vấn đề: chỉ ~15% mua → dữ liệu **mất cân bằng**

### 2. Chọn đặc trưng (features)

Lấy **17 cột** từ 42 cột để học:

| Nhóm | Số lượng | Ví dụ |
|---|---|---|
| Số (numerical) | 10 | `PageValues`, `BounceRates`, `avg_sentiment`, `total_engagement`, `global_avg_price`... |
| Phân loại (categorical) | 7 | `Month`, `Browser`, `VisitorType`, `Weekend`... |

### 3. Chia dữ liệu
- **80%** (160K) để học → `X_train, y_train`
- **20%** (40K) để kiểm tra → `X_test, y_test`
- Giữ nguyên tỷ lệ mua/không mua ở cả 2 phần

### 4. Tiền xử lý
- **Cột số:** chuẩn hóa về cùng thang đo (trừ trung bình, chia độ lệch)
- **Cột phân loại:** chuyển thành mã 0/1 (VD: `Month=Jan` → cột `Month_Jan=1`)

### 5. Xử lý mất cân bằng
- Vì chỉ 15% mua, model có xu hướng đoán "không mua" hoài
- Giải pháp: đặt **trọng số** cho class "mua" cao gấp ~5.5 lần, phạt nặng khi đoán sai

### 6. Huấn luyện 3 model

| Model | Đặc điểm |
|---|---|
| **Logistic Regression** | Công thức tuyến tính đơn giản, chạy nhanh, dùng làm baseline |
| **Random Forest** | 100 cây quyết định, học được pattern phức tạp |
| **XGBoost** | **Mạnh nhất** — boosting + regularization, chịu imbalance tốt |

Mỗi model được gói trong **Pipeline**: tự động tiền xử lý rồi mới học.

### 7. Đánh giá bằng Cross-Validation
- Chia dữ liệu làm 5 phần, lần lượt lấy 4 phần học + 1 phần kiểm tra (lặp 5 lần)
- Lấy trung bình kết quả → đánh giá **ổn định**, tránh overfit

**Chỉ số đánh giá chính:**
- **ROC-AUC:** khả năng phân biệt mua/không mua (0.5 = random, 1 = hoàn hảo)
- **F1:** cân bằng giữa precision (đoán đúng bao nhiêu %) và recall (bắt được bao nhiêu %)

### 8. Tìm ngưỡng tối ưu (Threshold Tuning)
- Mặc định: probability > 0.5 → "mua"
- Với dữ liệu mất cân bằng, ngưỡng 0.5 không tốt nhất
- Thử tất cả ngưỡng từ 0 → 1, chọn cái cho F1 cao nhất
- **Kết quả:** ngưỡng tối ưu ≈ **0.78** (thay vì 0.5)

### 9. Lưu kết quả

| File | Nội dung |
|---|---|
| `model.pkl` | Pipeline đã train (dùng để dự đoán sau này) |
| `features.json` | Danh sách các cột đã dùng |
| `metadata.json` | Metrics, version, ngày train |
| `optimal_threshold.json` | Ngưỡng tối ưu 0.78 |
| `evaluation_report.json` | Kết quả đầy đủ cả 3 model |

## Kết quả

| Model | ROC-AUC | F1 |
|---|---|---|
| Logistic Regression | ~0.856 | ~0.580 |
| Random Forest | ~0.942 | ~0.700 |
| **XGBoost** | **~0.961** | **~0.722** |

XGBoost được chọn làm model chính.

## Tóm tắt flow

```
File CSV (200K dòng, 42 cột)
  → Chọn 17 cột quan trọng
    → Chia 80% học / 20% kiểm tra
      → Tiền xử lý: chuẩn hóa số + mã hóa category
        → Học 3 model (LR, RF, XGBoost)
          → Chọn XGBoost tốt nhất
            → Tìm ngưỡng tối ưu (0.78)
              → Lưu model + báo cáo
```

## Chạy

```bash
python3 scripts/train_model.py
```
