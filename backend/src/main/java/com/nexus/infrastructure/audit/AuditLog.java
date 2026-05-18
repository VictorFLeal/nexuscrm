package com.nexus.infrastructure.audit;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id") private UUID userId;

    @Column(nullable = false, length = 100) private String action;

    @Column(length = 100) private String entity;

    @Column(name = "entity_id", length = 255) private String entityId;

    @Column(columnDefinition = "TEXT") private String details;

    @Column(name = "ip_address", length = 45) private String ipAddress;

    @Column(name = "user_agent", length = 500) private String userAgent;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
