package com.nexus.customer.controller;

import com.nexus.customer.dto.CustomerDtos.*;
import com.nexus.customer.service.CustomerService;
import com.nexus.shared.dto.PageResponse;
import com.nexus.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> findAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        customerService.findAll(search, status, page, size)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> findById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        customerService.findById(id)
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> create(
            @Valid @RequestBody CustomerRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                customerService.create(request),
                                "Cliente criado"
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody CustomerRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        customerService.update(id, request),
                        "Cliente atualizado"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        customerService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(null, "Cliente excluído")
        );
    }
}