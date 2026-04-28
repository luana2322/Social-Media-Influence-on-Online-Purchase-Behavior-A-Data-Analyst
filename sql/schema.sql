-- Job Queue Table (DB-based message queue)
CREATE TABLE IF NOT EXISTS job_queue (
    id SERIAL PRIMARY KEY,
    job_id INT,
    status VARCHAR(20) DEFAULT 'pending',
    retries INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    locked_by VARCHAR(100),
    locked_at TIMESTAMP,
    payload JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_queue_status ON job_queue(status);
CREATE INDEX IF NOT EXISTS idx_job_queue_locked_at ON job_queue(locked_at);

-- Prediction Job Table
CREATE TABLE IF NOT EXISTS prediction_job (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'pending',
    dataset_path VARCHAR(500),
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    progress FLOAT DEFAULT 0.0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prediction Results Table (with model versioning)
CREATE TABLE IF NOT EXISTS prediction_results (
    id SERIAL PRIMARY KEY,
    job_id INT,
    record_id VARCHAR(100),
    probability FLOAT,
    segment VARCHAR(20),
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pred_results_job_id ON prediction_results(job_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_job_queue_updated_at ON job_queue;
CREATE TRIGGER update_job_queue_updated_at BEFORE UPDATE ON job_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prediction_job_updated_at ON prediction_job;
CREATE TRIGGER update_prediction_job_updated_at BEFORE UPDATE ON prediction_job
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
