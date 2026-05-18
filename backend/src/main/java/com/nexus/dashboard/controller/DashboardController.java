package com.nexus.dashboard.controller;

import com.nexus.dashboard.service.DashboardService;
import com.nexus.shared.response.ApiResponse;
import com.nexus.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getSummary(user)));
    }

    @GetMapping("/revenue-chart")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRevenueChart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRevenueChart()));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecentActivity(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentActivity()));
    }

    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopProducts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTopProducts()));
    }
}
