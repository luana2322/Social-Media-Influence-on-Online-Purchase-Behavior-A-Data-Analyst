package com.example.socialpurchase.repository;

import com.example.socialpurchase.entity.PredictionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionResultRepository extends JpaRepository<PredictionResult, Long> {
    List<PredictionResult> findByJobId(Long jobId);
    void deleteByJobId(Long jobId);
}
