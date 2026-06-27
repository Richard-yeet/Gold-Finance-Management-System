package com.goldfinance.mapper;

import com.goldfinance.dto.CustomerRequest;
import com.goldfinance.dto.CustomerResponse;
import com.goldfinance.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerCode", ignore = true)
    @Mapping(target = "loans", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toEntity(CustomerRequest request);

    CustomerResponse toResponse(Customer customer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerCode", ignore = true)
    @Mapping(target = "loans", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void update(CustomerRequest request, @MappingTarget Customer customer);
}

