package com.nexus.customer.service;

import com.nexus.customer.dto.CustomerDtos.*;
import com.nexus.customer.entity.Customer;
import com.nexus.customer.repository.CustomerRepository;
import com.nexus.shared.dto.PageResponse;
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
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SanitizationUtils sanitization;

    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> findAll(
            String search,
            String status,
            int page,
            int size) {

        size = Math.min(Math.max(size, 1), 100);

        return PageResponse.from(
                customerRepository.findAll(
                        PageRequest.of(page, size, Sort.by("createdAt").descending())
                ).map(this::toResponse)
        );
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(UUID id) {
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public CustomerResponse create(CustomerRequest r) {

        Customer c = Customer.builder()
                .name(sanitization.sanitizeText(r.name()))
                .email(r.email())
                .phone(sanitization.sanitizeText(r.phone()))
                .company(sanitization.sanitizeText(r.company()))
                .status(r.status() != null ? r.status() : "ACTIVE")
                .notes(sanitization.sanitizeText(r.notes()))
                .build();

        return toResponse(customerRepository.save(c));
    }

    @Transactional
    public CustomerResponse update(UUID id, CustomerRequest r) {

        Customer c = getOrThrow(id);

        c.setName(sanitization.sanitizeText(r.name()));
        c.setEmail(r.email());
        c.setPhone(sanitization.sanitizeText(r.phone()));
        c.setCompany(sanitization.sanitizeText(r.company()));
        c.setStatus(r.status());
        c.setNotes(sanitization.sanitizeText(r.notes()));

        return toResponse(customerRepository.save(c));
    }

    @Transactional
    public void delete(UUID id) {
        customerRepository.delete(getOrThrow(id));
    }

    private Customer getOrThrow(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
    }

    private CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(
                c.getId(),
                c.getName(),
                c.getEmail(),
                c.getPhone(),
                c.getCompany(),
                c.getStatus(),
                c.getNotes(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}