# Kế Hoạch Triển Khai Mô Hình (Quy Mô Đồ Án Tốt Nghiệp)

## 1. Mục Tiêu
Cải thiện chất lượng mô hình XGBoost cho bài toán dự đoán mua hàng, bổ sung đầy đủ đánh giá học thuật, phục vụ báo cáo đồ án.

## 2. Ưu Tiên 1 (Bắt Buộc Hoàn Thành)
### 2.1 Xử Lý Mất Cân Bằng Dữ Liệu
- **File**: `scripts/train_model.py` (dòng 66)
- **Hành động**: Thêm tham số `scale_pos_weight` (tỷ lệ lớp 0/lớp 1 = ~5.46) vào XGBClassifier
- **Kết quả**: F1-score tăng từ 0.755 lên ~0.82

### 2.2 Bổ Sung 5-Fold Cross-Validation
- **File**: `scripts/train_model.py`
- **Hành động**: Thay thế `train_test_split` đơn lẻ bằng `StratifiedKFold`, báo cáo trung bình ± độ lệch chuẩn của ROC-AUC, F1
- **Mục đích**: Chứng minh tính ổn định của mô hình trong đồ án

### 2.3 Tinh Chỉnh Ngưỡng Dự Đoán
- **File**: `scripts/train_model.py`
- **Hành động**: Dùng `precision_recall_curve` tìm ngưỡng tối ưu (không dùng 0.5 mặc định), lưu ngưỡng vào `models/optimal_threshold.json`
- **Kết quả**: Tăng F1 thêm 3-5%

### 2.4 Bổ Sung Đánh Giá Thiếu Sót
- **File**: `scripts/train_model.py`, `models/evaluation_report.json`
- **Hành động**: Thêm các chỉ số bắt buộc cho đồ án:
  - PR-AUC (quan trọng cho dữ liệu mất cân bằng)
  - Confusion Matrix
  - Precision/Recall từng lớp
- **Mục đích**: Báo cáo đầy đủ kết quả học thuật

## 3. Ưu Tiên 2 (Tùy Chọn, Làm Nếu Còn Thời Gian)
### 3.1 Kiểm Tra Hiệu Chuẩn Mô Hình
- **Hành động**: Vẽ đường cong calibration, tính ECE (Expected Calibration Error)
- **Mục đích**: Báo cáo độ tin cậy của xác suất dự đoán (nếu đồ án yêu cầu)

### 3.2 SHAP Explainability
- **File**: `ml-service/main.py` (endpoint `/explain` đã có sẵn)
- **Hành động**: Xuất bảng top 5 đặc trưng quan trọng nhất cho báo cáo
- **Mục đích**: Giải thích mô hình (yêu cầu bắt buộc của nhiều đồ án)

## 4. Lộ Trình Thời Gian (Thực Tế Cho Sinh Viên)
| Nhiệm Vụ | Thời Gian Ước Lượng |
|----------|---------------------|
| Sửa lỗi ưu tiên 1 (2.1-2.4) | 6-8 tiếng |
| Nhiệm vụ tùy chọn (3.1-3.2) | 3-4 tiếng |
| Tổng cộng | ~10-12 tiếng |

## 5. Tiêu Chí Hoàn Thành Đồ Án
- ROC-AUC trung bình 5-fold > 0.94
- F1-score > 0.82 (sau khi tinh chỉnh)
- Đầy đủ báo cáo đánh giá: ROC-AUC, PR-AUC, F1, Precision, Recall, Confusion Matrix
- Có phần giải thích đặc trưng (SHAP) cho báo cáo
