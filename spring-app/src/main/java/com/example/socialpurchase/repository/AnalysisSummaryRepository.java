package com.example.socialpurchase.repository;

import com.example.socialpurchase.entity.AnalysisSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalysisSummaryRepository extends JpaRepository<AnalysisSummary, Long> {
    Optional<AnalysisSummary> findByJobId(Long jobId);
}
