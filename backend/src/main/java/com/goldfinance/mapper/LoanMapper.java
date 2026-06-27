package com.goldfinance.mapper;

import com.goldfinance.dto.LoanResponse;
import com.goldfinance.entity.Loan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {JewelleryItemMapper.class, PaymentMapper.class})
public interface LoanMapper {

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.name")
    LoanResponse toResponse(Loan loan);
}

