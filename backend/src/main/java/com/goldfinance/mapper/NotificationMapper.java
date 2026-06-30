package com.goldfinance.mapper;

import com.goldfinance.dto.NotificationResponse;
import com.goldfinance.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "read", source = "read")
    @Mapping(target = "referenceEntityType", source = "referenceEntityType")
    @Mapping(target = "referenceEntityId", source = "referenceEntityId")
    @Mapping(target = "referenceUrl", source = "referenceUrl")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    @Mapping(target = "createdBy", source = "createdBy")
    @Mapping(target = "updatedBy", source = "updatedBy")
    NotificationResponse toResponse(Notification notification);
}