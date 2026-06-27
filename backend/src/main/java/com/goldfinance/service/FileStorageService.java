package com.goldfinance.service;

import com.goldfinance.config.StorageProperties;
import com.goldfinance.entity.JewelleryPhoto;
import com.goldfinance.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final StorageProperties storageProperties;
    private Path root;

    @PostConstruct
    void init() throws IOException {
        root = Path.of(storageProperties.uploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public JewelleryPhoto store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("Cannot upload an empty file");
        }
        String contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();
        if (!contentType.startsWith("image/")) {
            throw new BusinessException("Only image uploads are supported");
        }
        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename());
        String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
        String storedName = UUID.randomUUID() + extension;
        Path target = root.resolve(storedName).normalize();
        try {
            file.transferTo(target);
        } catch (IOException ex) {
            throw new BusinessException("Could not store image: " + ex.getMessage());
        }
        return JewelleryPhoto.builder()
                .path(root.relativize(target).toString().replace("\\", "/"))
                .originalFileName(originalName)
                .contentType(contentType)
                .build();
    }
}

