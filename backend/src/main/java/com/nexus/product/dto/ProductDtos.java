package com.nexus.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class ProductDtos {

    public record ProductRequest(
        @NotBlank(message = "Nome é obrigatório") String name,
        @NotBlank(message = "SKU é obrigatório") String sku,
        String description,
        @NotNull @PositiveOrZero(message = "Preço deve ser positivo") BigDecimal price,
        @NotNull @PositiveOrZero(message = "Estoque deve ser positivo") Integer stock,
        String category, String status, String imageUrl) {}

    public record ProductResponse(
        UUID id, String name, String sku, String description,
        BigDecimal price, Integer stock, String category,
        String status, String imageUrl,
        LocalDateTime createdAt, LocalDateTime updatedAt) {}
}
