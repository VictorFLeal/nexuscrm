package com.nexus.auth.controller;

import com.nexus.auth.dto.AuthDtos.AuthResponse;
import com.nexus.auth.dto.AuthDtos.LoginRequest;
import com.nexus.auth.dto.AuthDtos.RefreshRequest;
import com.nexus.auth.dto.AuthDtos.RegisterRequest;
import com.nexus.auth.service.AuthService;
import com.nexus.shared.response.ApiResponse;
import com.nexus.user.dto.UserDtos.UserProfileResponse;
import com.nexus.user.entity.User;
import com.nexus.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(
                ApiResponse.success(authService.login(request, httpRequest))
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(authService.register(request, httpRequest)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshRequest request) {

        return ResponseEntity.ok(ApiResponse.success(authService.refresh(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> me(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(user)));
    }
}