package com.nexus.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDtos {

    public record UserProfileResponse(UUID id, String name, String email,
            String company, String role, LocalDateTime createdAt) {}

    public record UpdateProfileRequest(
            @NotBlank @Size(min = 2, max = 255) String name,
            @Size(max = 255) String company) {}

    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 6, max = 100) String newPassword,
            @NotBlank String confirmNewPassword) {}
}
