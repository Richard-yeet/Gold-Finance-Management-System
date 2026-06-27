package com.goldfinance.repository;

import com.goldfinance.entity.BankLoan;
import com.goldfinance.entity.BankLoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BankLoanRepository extends JpaRepository<BankLoan, Long> {

    List<BankLoan> findByStatusAndRenewalDateBetweenOrderByRenewalDateAsc(
            BankLoanStatus status,
            LocalDate from,
            LocalDate to
    );

    long countByStatus(BankLoanStatus status);
}

