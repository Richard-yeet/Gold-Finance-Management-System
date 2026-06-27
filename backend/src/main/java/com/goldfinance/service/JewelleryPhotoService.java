package com.goldfinance.service;

import com.goldfinance.dto.JewelleryPhotoResponse;
import com.goldfinance.exception.ResourceNotFoundException;
import com.goldfinance.mapper.JewelleryItemMapper;
import com.goldfinance.repository.JewelleryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JewelleryPhotoService {

    private final JewelleryItemRepository jewelleryItemRepository;
    private final FileStorageService fileStorageService;
    private final JewelleryItemMapper jewelleryItemMapper;
    private final AuditService auditService;

    @Transactional
    public List<JewelleryPhotoResponse> upload(Long jewelleryItemId, MultipartFile[] files) {
        var item = jewelleryItemRepository.findById(jewelleryItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Jewellery item not found"));
        var photos = Arrays.stream(files)
                .map(fileStorageService::store)
                .peek(item::addPhoto)
                .toList();
        var savedItem = jewelleryItemRepository.save(item);
        auditService.record("UPLOAD_PHOTO", "JewelleryItem", jewelleryItemId, "Uploaded " + photos.size() + " jewellery photos");
        return savedItem.getPhotos()
                .stream()
                .map(jewelleryItemMapper::toResponse)
                .toList();
    }
}

