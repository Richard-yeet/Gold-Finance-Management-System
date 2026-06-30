package com.goldfinance.repository;

import com.goldfinance.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    long countByReadFalse();

    List<Notification> findTop5ByOrderByCreatedAtDesc();

    Page<Notification> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.read = false AND n.createdAt >= :since")
    List<Notification> findUnreadSince(@Param("since") Instant since);

    List<Notification> findAllByReadFalse();
}