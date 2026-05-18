package com.nexus.product.controller;

import com.nexus.product.dto.ProductDtos.*;
import com.nexus.product.service.ProductService;
import com.nexus.shared.dto.PageResponse;
import com.nexus.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> findAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        productService.findAll(search, status, category, page, size)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        productService.findById(id)
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            @Valid @RequestBody ProductRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                productService.create(request),
                                "Produto criado"
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        productService.update(id, request),
                        "Produto atualizado"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {

        productService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(null, "Produto excluído")
        );
    }
}