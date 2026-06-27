package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.CustomerRequest;
import com.goldfinance.dto.CustomerResponse;
import com.goldfinance.dto.LoanResponse;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ApiResponse<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
        return ApiResponse.ok("Customer created", customerService.create(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> get(@PathVariable Long id) {
        return ApiResponse.ok("Customer fetched", customerService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CustomerResponse> update(@PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        return ApiResponse.ok("Customer updated", customerService.update(id, request));
    }

    @GetMapping
    public ApiResponse<PageResponse<CustomerResponse>> search(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ApiResponse.ok("Customers fetched", customerService.search(query, pageable));
    }

    @GetMapping("/{id}/loans")
    public ApiResponse<List<LoanResponse>> loanHistory(@PathVariable Long id) {
        return ApiResponse.ok("Customer loan history fetched", customerService.loanHistory(id));
    }
}

