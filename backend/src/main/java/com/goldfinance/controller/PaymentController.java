package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.PaymentRequest;
import com.goldfinance.dto.PaymentResponse;
import com.goldfinance.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/loans/{loanId}/payments")
    public ApiResponse<PaymentResponse> record(@PathVariable Long loanId, @Valid @RequestBody PaymentRequest request) {
        return ApiResponse.ok("Payment recorded", paymentService.record(loanId, request));
    }

    @GetMapping("/loans/{loanId}/payments")
    public ApiResponse<List<PaymentResponse>> history(@PathVariable Long loanId) {
        return ApiResponse.ok("Payment history fetched", paymentService.history(loanId));
    }

    @GetMapping(value = "/payments/{paymentId}/receipt", produces = MediaType.TEXT_PLAIN_VALUE)
    public String receipt(@PathVariable Long paymentId) {
        return paymentService.receipt(paymentId);
    }
}

