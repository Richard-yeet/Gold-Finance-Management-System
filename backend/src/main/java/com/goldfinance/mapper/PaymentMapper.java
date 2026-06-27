package com.goldfinance.mapper;

import com.goldfinance.dto.PaymentResponse;
import com.goldfinance.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "loanId", source = "loan.id")
    @Mapping(target = "loanNumber", source = "loan.loanNumber")
    PaymentResponse toResponse(Payment payment);
}

