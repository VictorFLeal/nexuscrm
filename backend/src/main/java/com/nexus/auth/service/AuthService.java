package com.nexus.auth.service;

import com.nexus.auth.dto.AuthDtos.*;
import com.nexus.auth.entity.RefreshToken;
import com.nexus.auth.repository.RefreshTokenRepository;
import com.nexus.infrastructure.audit.AuditService;
import com.nexus.security.JwtService;
import com.nexus.shared.exception.BusinessException;
import com.nexus.user.entity.User;
import com.nexus.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository         userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService             jwtService;
    private final PasswordEncoder        passwordEncoder;
    private final AuthenticationManager  authenticationManager;
    private final AuditService           auditService;

    @Value("${jwt.expiration}") private long jwtExpiration;
    @Value("${jwt.refresh-expiration}") private long refreshExpiration;
    @Value("${security.max-login-attempts:5}") private int maxLoginAttempts;
    @Value("${security.lockout-duration-minutes:15}") private int lockoutMinutes;

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String email = request.email().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Credenciais inválidas"));

        if (user.isLocked())
            throw new BusinessException("Conta temporariamente bloqueada. Tente novamente mais tarde.");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (BadCredentialsException e) {
            user.incrementLoginAttempts();
            if (user.getLoginAttempts() >= maxLoginAttempts) {
                user.lockAccount(lockoutMinutes);
                log.warn("Account locked: {}", email);
            }
            userRepository.save(user);
            throw new BusinessException("Credenciais inválidas");
        } catch (LockedException e) {
            throw new BusinessException("Conta temporariamente bloqueada.");
        }

        user.resetLoginAttempts();
        userRepository.save(user);
        refreshTokenRepository.deleteByUser(user);

        String accessToken  = jwtService.generateToken(user);
        String refreshToken = createRefreshToken(user);

        auditService.log(user.getId(), "LOGIN", "User", user.getId().toString(),
                "Login successful", getIp(httpRequest), getUa(httpRequest));

        return buildResponse(accessToken, refreshToken, user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        String email = request.email().toLowerCase().trim();
        if (userRepository.existsByEmail(email))
            throw new BusinessException("Email já cadastrado");

        User user = User.builder()
                .name(request.name().trim()).email(email)
                .password(passwordEncoder.encode(request.password()))
                .company(request.company().trim()).role("USER").build();
        userRepository.save(user);

        String accessToken  = jwtService.generateToken(user);
        String refreshToken = createRefreshToken(user);
        auditService.log(user.getId(), "REGISTER", "User", user.getId().toString(),
                "New user registered", getIp(httpRequest), getUa(httpRequest));
        return buildResponse(accessToken, refreshToken, user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken stored = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new BusinessException("Refresh token inválido"));
        if (stored.isExpired()) {
            refreshTokenRepository.delete(stored);
            throw new BusinessException("Refresh token expirado. Faça login novamente.");
        }
        User user = stored.getUser();
        refreshTokenRepository.delete(stored);
        return buildResponse(jwtService.generateToken(user), createRefreshToken(user), user);
    }

    private String createRefreshToken(User user) {
        RefreshToken t = RefreshToken.builder().token(UUID.randomUUID().toString()).user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpiration / 1000)).build();
        return refreshTokenRepository.save(t).getToken();
    }

    private AuthResponse buildResponse(String at, String rt, User u) {
        return new AuthResponse(at, rt, "Bearer", jwtExpiration,
                new UserInfo(u.getId(), u.getName(), u.getEmail(),
                        u.getCompany(), u.getRole(), u.getCreatedAt()));
    }

    private String getIp(HttpServletRequest r) {
        if (r == null) return null;
        String ip = r.getHeader("X-Forwarded-For");
        return (ip != null && !ip.isBlank()) ? ip.split(",")[0].trim() : r.getRemoteAddr();
    }

    private String getUa(HttpServletRequest r) {
        return r == null ? null : r.getHeader("User-Agent");
    }
}
