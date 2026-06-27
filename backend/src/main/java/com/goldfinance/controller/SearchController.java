package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.SearchResult;
import com.goldfinance.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ApiResponse<List<SearchResult>> search(@RequestParam String query) {
        return ApiResponse.ok("Search results fetched", searchService.globalSearch(query));
    }
}

