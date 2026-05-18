package com.nexus.shared.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class RequestUtils {
    public String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip))
            return ip.split(",")[0].trim();
        ip = request.getHeader("X-Real-IP");
        return (ip != null && !ip.isBlank()) ? ip : request.getRemoteAddr();
    }

    public String getUserAgent(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        if (ua == null) return "unknown";
        return ua.length() > 500 ? ua.substring(0, 500) : ua;
    }
}
