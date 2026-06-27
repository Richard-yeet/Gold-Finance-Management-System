package com.goldfinance.mapper;

import com.goldfinance.dto.BankLoanRequest;
import com.goldfinance.dto.BankLoanResponse;
import com.goldfinance.entity.BankLoan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Mapper(componentModel = "spring")
public interface BankLoanMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BankLoan toEntity(BankLoanRequest request);

    @Mapping(target = "daysUntilRenewal", expression = "java(daysUntilRenewal(bankLoan))")
    BankLoanResponse toResponse(BankLoan bankLoan);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void update(BankLoanRequest request, @MappingTarget BankLoan bankLoan);

    default long daysUntilRenewal(BankLoan bankLoan) {
        return ChronoUnit.DAYS.between(LocalDate.now(), bankLoan.getRenewalDate());
    }
}

