package com.nexus.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;

public class CustomerDtos {

    public record CustomerRequest(
        @NotBlank(message = "Nome é obrigatório") String name,
        @Email(message = "Email inválido") String email,
        String phone, String company, String status, String notes) {}

    public record CustomerResponse(
        UUID id, String name, String email, String phone,
        String company, String status, String notes,
        LocalDateTime createdAt, LocalDateTime updatedAt) {}
}
