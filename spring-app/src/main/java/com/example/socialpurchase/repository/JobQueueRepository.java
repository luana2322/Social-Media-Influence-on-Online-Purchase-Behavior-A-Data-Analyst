package com.example.socialpurchase.repository;

import com.example.socialpurchase.entity.JobQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JobQueueRepository extends JpaRepository<JobQueue, Long> {

    @Query(value = "SELECT * FROM job_queue " +
           "WHERE status = 'pending' " +
           "OR (status = 'processing' AND locked_at < NOW() - INTERVAL '10 minutes') " +
           "ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED",
           nativeQuery = true)
    Optional<JobQueue> findPendingJobWithSkipLocked();

    @Query(value = "SELECT COUNT(*) FROM job_queue WHERE status = :status",
           nativeQuery = true)
    Integer countByStatus(@Param("status") String status);
}
