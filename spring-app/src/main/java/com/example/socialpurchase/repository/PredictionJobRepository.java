package com.example.socialpurchase.repository;

import com.example.socialpurchase.entity.PredictionJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionJobRepository extends JpaRepository<PredictionJob, Long> {
    List<PredictionJob> findByStatus(String status);

    @Query("SELECT j FROM PredictionJob j ORDER BY j.createdAt DESC")
    List<PredictionJob> findAllOrderByCreatedAtDesc();
}
