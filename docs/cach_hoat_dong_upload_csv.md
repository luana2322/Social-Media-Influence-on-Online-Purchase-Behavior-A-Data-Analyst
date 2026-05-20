# Cách Hoạt Động của Chức Năng Upload CSV và Xử Lý

## Kiến trúc tổng thể

```
Frontend (port 3000)
  → POST /api/jobs/upload ────────────→ Spring Boot (port 8080)
                                          │
                                          ├─ JobProducerService: lưu file + tạo job
                                          │
                                          └─ JobWorkerService (background thread, poll mỗi 5s)
                                               │
                                               ├─ DatasetStreamingService: đọc CSV từng dòng
                                               │     ├─ SchemaMapper: ánh xạ tên cột
                                               │     ├─ ColumnValidator: kiểm tra cột
                                               │     └─ MLBatchService: gửi chunk đến ML
                                               │
                                               ├─ MLServiceClient ───→ FastAPI (port 8000)
                                               │                           └─ XGBoost predict
                                               │
                                               └─ RecommendationEngine: sinh gợi ý sau khi xong
```

---

## Bước 1: Upload file (dòng 31-41 BatchJobController.java)

```java
@PostMapping("/upload")
public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file,
                                        Authentication authentication) {
    User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
    Long jobId = jobProducerService.createJob(file, user.getId());
    return ResponseEntity.ok().body(String.format("{\"jobId\": %d, \"status\": \"pending\"}", jobId));
}
```

- Nhận file CSV từ request multipart
- Lấy user từ JWT authentication
- Gọi `JobProducerService.createJob()` → trả về `jobId`
- Response ngay lập tức: `{"jobId": 47, "status": "pending"}` — không chờ xử lý

---

## Bước 2: JobProducerService — Lưu file + tạo queue (dòng 29-49 JobProducerService.java)

```java
public Long createJob(MultipartFile file, Long userId) throws IOException {
    Files.createDirectories(Paths.get(UPLOAD_DIR));            // tạo /app/uploads/
    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    Path filePath = Paths.get(UPLOAD_DIR, filename);
    file.transferTo(filePath.toFile());                        // lưu file vào ổ đĩa

    PredictionJob job = new PredictionJob();
    job.setStatus("pending");
    job.setUserId(userId);
    job.setDatasetPath(filePath.toString());                   // đường dẫn file
    predictionJobRepository.save(job);                         // lưu vào DB

    JobQueue queueItem = new JobQueue();
    queueItem.setJobId(job.getId());
    queueItem.setPayload(String.format(
        "{\"datasetPath\": \"%s\", \"jobId\": %d}", filePath, job.getId()));
    jobQueueRepository.save(queueItem);                        // đưa vào hàng đợi

    return job.getId();
}
```

Công việc:
1. Tạo thư mục uploads nếu chưa có
2. Lưu file với tên ngẫu nhiên (tránh trùng)
3. Tạo `PredictionJob` trong DB với status `pending`
4. Tạo `JobQueue` entry — hàng đợi để worker xử lý sau

---

## Bước 3: JobWorkerService — Worker nền (dòng 29-44 JobWorkerService.java)

```java
public void startWorker() {
    new Thread(() -> {
        while (true) {
            processNextJob();             // xử lý job nếu có
            Thread.sleep(5000);           // poll mỗi 5 giây
        }
    }).start();
}
```

Chạy ngay khi Spring Boot start. Luồng riêng (không block API). Mỗi 5 giây kiểm tra queue.

### processNextJob() (dòng 47-63)

```java
private void processNextJob() {
    Optional<JobQueue> jobOpt = jobQueueRepository.findPendingJobWithSkipLocked();
    if (jobOpt.isEmpty()) return;              // không có job → chờ 5s

    JobQueue jobQueue = jobOpt.get();
    lockJob(jobQueue);                         // lock để worker khác không lấy
    processJob(jobQueue);                      // xử lý chính
    markJobDone(jobQueue);                     // đánh dấu done
}
```

### lockJob() (dòng 65-70)

```java
jobQueue.setStatus("processing");
jobQueue.setLockedBy(WORKER_ID);               // UUID của worker này
jobQueue.setLockedAt(LocalDateTime.now());
```

Cơ chế **skip locked**: các worker khác nhau (nếu chạy multi-instance) sẽ không lấy cùng một job.

### processJob() — xử lý chính (dòng 72-98)

```java
datasetStreamingService.streamAndProcess(datasetPath, jobId);
// → Đọc CSV, schema mapping, gửi đến ML service, lưu kết quả

predictionJob.setStatus("completed");
// → Cập nhật job thành completed

recommendationEngine.generateAndSave(jobId);
// → Sinh recommendations từ segment distribution
```

---

## Bước 4: DatasetStreamingService — Đọc CSV + Mapping (dòng 28-91 DatasetStreamingService.java)

```java
public int streamAndProcess(String datasetPath, Long jobId) throws IOException {
    try (BufferedReader br = new BufferedReader(new FileReader(datasetPath))) {
        String line;
        boolean isHeader = true;

        while ((line = br.readLine()) != null) {
            if (isHeader) {
                headers = parseCSVLine(line);                          // đọc header
                idColumn = detectIdColumn(headers);                    // tìm cột ID
                columnMapping = schemaMapper.mapColumns(headers);      // ánh xạ tên cột
                job.setDatasetType(detectDatasetType(headers));        // detect loại dataset
                job.setColumnWarnings(buildWarningsJson(headers, columnMapping));
                // → ECOMMERCE / SOCIAL_MEDIA / WEB_ANALYTICS / GENERAL
                isHeader = false;
                continue;
            }

            String[] values = parseCSVLine(line);                     // đọc 1 dòng dữ liệu
            Map<String, Object> rawRecord = new HashMap<>();
            for (int i = 0; i < Math.min(headers.length, values.length); i++) {
                rawRecord.put(headers[i].trim(), values[i].trim());   // map header → value
            }
            chunk.add(schemaMapper.normalizeRecord(rawRecord, columnMapping));
            // → normalize: đổi tên cột + cast kiểu + default values

            if (chunk.size() == CHUNK_SIZE) {                         // đủ 1000 dòng
                mlBatchService.processChunk(chunk, recordIds, jobId, job.getDatasetType());
                chunk.clear();                                        // gửi batch
                updateProgress(job, totalRecords);                    // cập nhật %
            }
        }
        if (!chunk.isEmpty()) {                                       // chunk cuối
            mlBatchService.processChunk(chunk, recordIds, jobId, job.getDatasetType());
        }
        job.setTotalRecords(totalRecords);
        job.setProgressPercent(100.0f);
    }
}
```

**Các bước xử lý từng dòng:**

| Thành phần | Chức năng |
|---|---|
| `parseCSVLine()` | Tách dòng CSV thành mảng string (hỗ trợ quoted fields) |
| `detectIdColumn()` | Tự động tìm cột ID (id, customer_id, user_id...) |
| `detectDatasetType()` | Dựa vào tên cột → ECOMMERCE / SOCIAL_MEDIA / WEB_ANALYTICS / GENERAL |
| `schemaMapper.mapColumns()` | Ánh xạ tên cột bất kỳ → 17 chuẩn (alias + fuzzy match) |
| `schemaMapper.normalizeRecord()` | Chuẩn hóa giá trị (cast số, default nếu thiếu) |
| `columnValidator.validate()` | Sinh warnings (cột thiếu, cột lạ) |

**Dataset type detection** (dòng 122-134):
```java
if (header có "purchase" / "revenue" / "cart")       → ECOMMERCE
if (header có "sentiment" / "engagement" / "social")  → SOCIAL_MEDIA
if (header có "page" / "bounce" / "exit")             → WEB_ANALYTICS
else                                                    → GENERAL
```

---

## Bước 5: MLBatchService — Gửi đến ML (dòng 22-61 MLBatchService.java)

```java
public void processChunk(List<Map<String, Object>> chunk, List<String> recordIds,
                          Long jobId, String datasetType) {
    List<BatchPredictionResponse> predictions =
        mlServiceClient.batchPredictChunk(chunk, datasetType);
    // → gọi FastAPI /batch_predict_chunk

    List<PredictionResult> results = new ArrayList<>();
    for (int i = 0; i < predictions.size(); i++) {
        PredictionResult result = new PredictionResult();
        result.setJobId(jobId);
        result.setRecordId(recordId);                  // ID từ CSV hoặc row_N
        result.setProbability(pred.getProbability());  // purchase_probability
        result.setSegment(pred.getSegment());           // High/Medium/Low
        result.setModelVersion(pred.getModelVersion());
        results.add(result);
    }
    batchInsert(results);                              // lưu batch 1000 vào DB
}
```

---

## Bước 6: MLServiceClient — HTTP đến FastAPI (dòng 27-59 MLServiceClient.java)

```java
public List<BatchPredictionResponse> batchPredictChunk(List<Map<String, Object>> chunk,
                                                        String datasetType) {
    Map<String, Object> requestBody = new LinkedHashMap<>();
    requestBody.put("datasetType", datasetType != null ? datasetType : "GENERAL");

    List<Map<String, Object>> records = chunk.stream()
        .map(record -> {
            Map<String, Object> req = new LinkedHashMap<>();
            req.put("recordId", record.getOrDefault("id", "unknown").toString());
            req.put("features", record);
            return req;
        }).toList();
    requestBody.put("records", records);

    List<BatchPredictionResponse> responses = webClient.post()
        .uri("/batch_predict_chunk")
        .body(Mono.just(requestBody), Map.class)
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<List<BatchPredictionResponse>>() {})
        .retryWhen(Retry.backoff(3, Duration.ofMillis(500)))  // retry 3 lần
        .block();

    return responses;
}
```

Gửi request JSON đến FastAPI:
```json
{
  "datasetType": "GENERAL",
  "records": [
    {"recordId": "1", "features": {"PageValues": 80, "BounceRates": 0.01, ...}},
    ...
  ]
}
```

FastAPI trả về:
```json
[
  {"recordId": "1", "probability": 0.9999, "segment": "High", "modelVersion": "1.1.0"},
  ...
]
```

---

## Bước 7: FastAPI — Predict (dòng 204-250 main.py)

```python
@app.post("/batch_predict_chunk")
async def batch_predict_chunk(request: BatchPredictRequest):
    model = get_or_load_model(dataset_type)
    # → load model từ cache hoặc file, fallback nếu cần

    df = pd.DataFrame([r.features for r in records])
    schema = features_cache.get(actual_type, {})
    df = df[schema['all_features']]        # đúng thứ tự 17 cột

    probabilities = model.predict_proba(df)[:, 1]    # XGBoost predict

    # Phân segment dựa trên threshold tối ưu
    segments = np.where(probabilities > 0.8, "High",
               np.where(probabilities > opt_threshold, "Medium", "Low"))

    return [BatchPredictResponse(...) for i in range(len(records))]
```

---

## Bước 8: RecommendationEngine — Sinh gợi ý

Sau khi tất cả chunks được xử lý, `RecommendationEngine.generateAndSave(jobId)` (dòng 93-98 JobWorkerService.java) đếm số lượng High/Medium/Low và sinh recommendations dạng template:

```
"60% sessions have >80% purchase probability. Action: Target these users..."
"25% sessions have low purchase probability. Action: Run retargeting campaigns..."
```

---

## Tổng kết flow

```
User upload CSV → API trả về jobId ngay lập tức
                     ↓
Worker (poll 5s) nhặt job từ queue
  ↓
Đọc CSV từng dòng (streaming, không load hết vào RAM)
  ↓
SchemaMapper: ánh xạ tên cột bất kỳ → 17 chuẩn
  ↓
Gom 1000 dòng → 1 chunk
  ↓
Gửi chunk đến FastAPI /batch_predict_chunk
  ↓
FastAPI: XGBoost predict → probability + segment
  ↓
Lưu kết quả vào DB (PredictionResult)
  ↓
Lặp cho đến hết file
  ↓
RecommendationEngine: sinh gợi ý từ segment distribution
  ↓
Job status = "completed"
```

## Các file liên quan

| File | Vai trò |
|---|---|
| `BatchJobController.java` | Endpoint upload |
| `JobProducerService.java` | Lưu file + tạo job queue |
| `JobWorkerService.java` | Worker nền poll queue |
| `DatasetStreamingService.java` | Streaming + chunking |
| `SchemaMapper.java` | Ánh xạ tên cột (alias + fuzzy) |
| `ColumnValidator.java` | Kiểm tra + warnings |
| `MLBatchService.java` | Gửi chunk + lưu kết quả |
| `MLServiceClient.java` | HTTP client gọi FastAPI |
| `ml-service/main.py` | FastAPI predict |
| `RecommendationEngine.java` | Sinh gợi ý |
