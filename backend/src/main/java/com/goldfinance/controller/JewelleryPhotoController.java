package com.goldfinance.controller;

import com.goldfinance.dto.ApiResponse;
import com.goldfinance.dto.JewelleryPhotoResponse;
import com.goldfinance.service.JewelleryPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/jewellery-items")
@RequiredArgsConstructor
public class JewelleryPhotoController {

    private final JewelleryPhotoService jewelleryPhotoService;

    @PostMapping("/{id}/photos")
    public ApiResponse<List<JewelleryPhotoResponse>> upload(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        return ApiResponse.ok("Photos uploaded", jewelleryPhotoService.upload(id, files));
    }
}

