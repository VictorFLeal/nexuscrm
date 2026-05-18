package com.nexus.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexus.shared.utils.RequestUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final RequestUtils requestUtils;

    @Value("${security.rate-limit.auth-requests-per-minute:10}")
    private int authLimit;

    @Value("${security.rate-limit.api-requests-per-minute:200}")
    private int apiLimit;

    // ip -> [count, windowStartMs]
    private final ConcurrentHashMap<String, long[]> authCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, long[]> apiCounters  = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {

        String ip   = requestUtils.getClientIp(request);
        String path = request.getRequestURI();
        boolean isAuth = path.contains("/auth/login") || path.contains("/auth/register");

        ConcurrentHashMap<String, long[]> counters = isAuth ? authCounters : apiCounters;
        int limit = isAuth ? authLimit : apiLimit;

        if (!isAllowed(ip, counters, limit)) {
            log.warn("Rate limit exceeded: ip={} path={}", ip, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(objectMapper.writeValueAsString(Map.of(
                    "success", false,
                    "error", "Muitas requisições. Tente novamente em instantes."
            )));
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean isAllowed(String ip, ConcurrentHashMap<String, long[]> counters, int limit) {
        long now = System.currentTimeMillis();
        long windowMs = 60_000L;

        counters.compute(ip, (k, v) -> {
            if (v == null || now - v[1] > windowMs) {
                return new long[]{1, now};
            }
            v[0]++;
            return v;
        });

        long[] entry = counters.get(ip);
        return entry[0] <= limit;
    }
}
