package com.goldfinance.service;

import com.goldfinance.entity.AuditLog;
import com.goldfinance.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void record(String action, String entityName, Object entityId, String details) {
        auditLogRepository.save(AuditLog.builder()
                .action(action)
                .entityName(entityName)
                .entityId(entityId == null ? null : String.valueOf(entityId))
                .details(details)
                .build());
    }
}

