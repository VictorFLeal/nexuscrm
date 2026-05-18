package com.nexus.infrastructure.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(UUID userId, String action, String entity, String entityId,
                    String details, String ipAddress, String userAgent) {
        try {
            auditLogRepository.save(AuditLog.builder()
                    .userId(userId).action(action).entity(entity).entityId(entityId)
                    .details(details).ipAddress(ipAddress).userAgent(userAgent).build());
        } catch (Exception e) {
            log.error("Audit log failed: action={}, error={}", action, e.getMessage());
        }
    }

    @Async
    public void log(String action, String details) {
        log(null, action, null, null, details, null, null);
    }
}
