package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.BankLoanRequest;
import com.goldfinance.dto.BankLoanResponse;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.service.BankLoanService;
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
@RequestMapping("/api/bank-loans")
@RequiredArgsConstructor
public class BankLoanController {

    private final BankLoanService bankLoanService;

    @PostMapping
    public ApiResponse<BankLoanResponse> create(@Valid @RequestBody BankLoanRequest request) {
        return ApiResponse.ok("Bank loan created", bankLoanService.create(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<BankLoanResponse> get(@PathVariable Long id) {
        return ApiResponse.ok("Bank loan fetched", bankLoanService.get(id));
    }

    @GetMapping
    public ApiResponse<PageResponse<BankLoanResponse>> list(@PageableDefault(size = 20, sort = "renewalDate") Pageable pageable) {
        return ApiResponse.ok("Bank loans fetched", bankLoanService.list(pageable));
    }

    @GetMapping("/renewals")
    public ApiResponse<List<BankLoanResponse>> renewals(@RequestParam(defaultValue = "90") int days) {
        return ApiResponse.ok("Bank loan renewals fetched", bankLoanService.renewalsWithin(days));
    }

    @PutMapping("/{id}")
    public ApiResponse<BankLoanResponse> update(@PathVariable Long id, @Valid @RequestBody BankLoanRequest request) {
        return ApiResponse.ok("Bank loan updated", bankLoanService.update(id, request));
    }
}

