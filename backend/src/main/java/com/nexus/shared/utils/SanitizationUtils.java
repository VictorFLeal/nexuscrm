package com.nexus.shared.utils;

import org.springframework.stereotype.Component;

@Component
public class SanitizationUtils {

    public String sanitizeText(String input) {
        if (input == null) return null;
        return input
                .replaceAll("<[^>]*>", "")
                .replaceAll("javascript:", "")
                .replaceAll("on\\w+\\s*=\\s*\"[^\"]*\"", "")
                .trim();
    }

    public String sanitizeSearchTerm(String input) {
        if (input == null || input.isBlank()) return null;
        return input
                .replaceAll("[%_\\\\]", "\\\\$0")
                .replaceAll("[<>\"'`]", "")
                .trim();
    }
}
