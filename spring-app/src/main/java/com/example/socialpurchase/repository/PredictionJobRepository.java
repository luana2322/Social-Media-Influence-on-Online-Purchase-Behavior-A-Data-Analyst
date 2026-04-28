package com.example.socialpurchase.repository;

import com.example.socialpurchase.entity.PredictionJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionJobRepository extends JpaRepository<PredictionJob, Long> {
    List<PredictionJob> findByStatus(String status);
}
