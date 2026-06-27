package com.goldfinance.mapper;

import com.goldfinance.dto.JewelleryItemRequest;
import com.goldfinance.dto.JewelleryItemResponse;
import com.goldfinance.dto.JewelleryPhotoResponse;
import com.goldfinance.entity.JewelleryItem;
import com.goldfinance.entity.JewelleryPhoto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JewelleryItemMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "loan", ignore = true)
    @Mapping(target = "photos", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    JewelleryItem toEntity(JewelleryItemRequest request);

    JewelleryItemResponse toResponse(JewelleryItem item);

    JewelleryPhotoResponse toResponse(JewelleryPhoto photo);
}

