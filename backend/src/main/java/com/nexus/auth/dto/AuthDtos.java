package com.nexus.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public class AuthDtos {

    public record LoginRequest(
        @NotBlank(message = "Email é obrigatório") @Email(message = "Email inválido") String email,
        @NotBlank(message = "Senha é obrigatória") String password) {}

    public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 255) String name,
        @NotBlank @Email(message = "Email inválido") String email,
        @NotBlank @Size(max = 255) String company,
        @NotBlank @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres") String password) {}

    public record RefreshRequest(
        @NotBlank(message = "Refresh token é obrigatório") String refreshToken) {}

    public record AuthResponse(
        String accessToken, String refreshToken, String tokenType,
        long expiresIn, UserInfo user) {}

    public record UserInfo(UUID id, String name, String email,
        String company, String role, LocalDateTime createdAt) {}
}
