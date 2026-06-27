package com.goldfinance.repository;

import com.goldfinance.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByLoanIdOrderByPaymentDateAsc(Long loanId);

    List<Payment> findByPaymentDateBetweenOrderByPaymentDateAsc(LocalDate from, LocalDate to);

    List<Payment> findTop8ByOrderByCreatedAtDesc();

    @Query("select coalesce(sum(p.amount), 0) from Payment p where p.paymentDate = :paymentDate")
    BigDecimal sumCollectionsOn(@Param("paymentDate") LocalDate paymentDate);

    @Query("select coalesce(sum(p.interestComponent), 0) from Payment p where p.paymentDate between :from and :to")
    BigDecimal sumInterestBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);
}

