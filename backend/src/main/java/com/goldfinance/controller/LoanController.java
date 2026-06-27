package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.LoanCreateRequest;
import com.goldfinance.dto.LoanResponse;
import com.goldfinance.dto.LoanUpdateRequest;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.service.LoanService;
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

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ApiResponse<LoanResponse> create(@Valid @RequestBody LoanCreateRequest request) {
        return ApiResponse.ok("Loan created", loanService.create(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<LoanResponse> get(@PathVariable Long id) {
        return ApiResponse.ok("Loan fetched", loanService.get(id));
    }

    @GetMapping
    public ApiResponse<PageResponse<LoanResponse>> list(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ApiResponse.ok("Loans fetched", loanService.list(query, pageable));
    }

    @PutMapping("/{id}")
    public ApiResponse<LoanResponse> update(@PathVariable Long id, @Valid @RequestBody LoanUpdateRequest request) {
        return ApiResponse.ok("Loan updated", loanService.update(id, request));
    }

    @PostMapping("/{id}/close")
    public ApiResponse<LoanResponse> close(@PathVariable Long id) {
        return ApiResponse.ok("Loan closed", loanService.close(id));
    }

    @PostMapping("/{id}/renew")
    public ApiResponse<LoanResponse> renew(@PathVariable Long id) {
        return ApiResponse.ok("Loan renewed", loanService.renew(id));
    }
}

