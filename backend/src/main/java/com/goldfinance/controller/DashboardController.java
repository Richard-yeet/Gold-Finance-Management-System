package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.DashboardResponse;
import com.goldfinance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> dashboard() {
        return ApiResponse.ok("Dashboard fetched", dashboardService.dashboard());
    }
}

