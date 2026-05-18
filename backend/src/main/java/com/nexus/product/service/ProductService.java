package com.nexus.product.service;

import com.nexus.product.dto.ProductDtos.*;
import com.nexus.product.entity.Product;
import com.nexus.product.repository.ProductRepository;
import com.nexus.shared.dto.PageResponse;
import com.nexus.shared.exception.BusinessException;
import com.nexus.shared.exception.ResourceNotFoundException;
import com.nexus.shared.utils.SanitizationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SanitizationUtils sanitization;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> findAll(
            String search,
            String status,
            String category,
            int page,
            int size) {

        size = Math.min(Math.max(size, 1), 100);

        return PageResponse.from(
                productRepository.findAll(
                        PageRequest.of(page, size, Sort.by("createdAt").descending())
                ).map(this::toResponse)
        );
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest r) {

        String sku = sanitization.sanitizeText(r.sku());

        if (productRepository.existsBySku(sku)) {
            throw new BusinessException("SKU já existe: " + sku);
        }

        Product p = Product.builder()
                .name(sanitization.sanitizeText(r.name()))
                .sku(sku)
                .description(sanitization.sanitizeText(r.description()))
                .price(r.price())
                .stock(r.stock())
                .category(sanitization.sanitizeText(r.category()))
                .status(r.status() != null ? r.status() : "ACTIVE")
                .imageUrl(r.imageUrl())
                .build();

        return toResponse(productRepository.save(p));
    }

    @Transactional
    public ProductResponse update(UUID id, ProductRequest r) {

        Product p = getOrThrow(id);

        String sku = sanitization.sanitizeText(r.sku());

        if (productRepository.existsBySkuAndIdNot(sku, id)) {
            throw new BusinessException("SKU já existe: " + sku);
        }

        p.setName(sanitization.sanitizeText(r.name()));
        p.setSku(sku);
        p.setDescription(sanitization.sanitizeText(r.description()));
        p.setPrice(r.price());
        p.setStock(r.stock());
        p.setCategory(sanitization.sanitizeText(r.category()));
        p.setStatus(r.status());
        p.setImageUrl(r.imageUrl());

        return toResponse(productRepository.save(p));
    }

    @Transactional
    public void delete(UUID id) {
        productRepository.delete(getOrThrow(id));
    }

    private Product getOrThrow(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getSku(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getCategory(),
                p.getStatus(),
                p.getImageUrl(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}