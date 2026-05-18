package com.nexus.product.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private String sku;
    @Column(columnDefinition = "TEXT") private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default private BigDecimal price = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default private Integer stock = 0;

    private String category;

    @Column(nullable = false)
    @Builder.Default private String status = "ACTIVE";

    @Column(name = "image_url") private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
