package com.nexus.user.service;

import com.nexus.shared.exception.BusinessException;
import com.nexus.user.dto.UserDtos.*;
import com.nexus.user.entity.User;
import com.nexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(User user) { return toResponse(user); }

    @Transactional
    public UserProfileResponse updateProfile(User user, UpdateProfileRequest req) {
        user.setName(req.name());
        user.setCompany(req.company());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest req) {
        if (!passwordEncoder.matches(req.currentPassword(), user.getPassword()))
            throw new BusinessException("Senha atual incorreta");
        if (!req.newPassword().equals(req.confirmNewPassword()))
            throw new BusinessException("As senhas não conferem");
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }

    private UserProfileResponse toResponse(User u) {
        return new UserProfileResponse(u.getId(), u.getName(), u.getEmail(),
                u.getCompany(), u.getRole(), u.getCreatedAt());
    }
}
