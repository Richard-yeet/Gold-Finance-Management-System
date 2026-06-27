package com.goldfinance.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
public class LoanNumberGenerator {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(propagation = Propagation.MANDATORY)
    public String nextLoanNumber() {
        Number next = (Number) entityManager.createNativeQuery("select nextval('loan_number_seq')").getSingleResult();
        return "GFL-%d-%06d".formatted(LocalDate.now().getYear(), next.longValue());
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public String nextReceiptNumber() {
        Number next = (Number) entityManager.createNativeQuery("select nextval('receipt_number_seq')").getSingleResult();
        return "RCP-%d-%06d".formatted(LocalDate.now().getYear(), next.longValue());
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public String nextCustomerCode() {
        Number next = (Number) entityManager.createNativeQuery("select nextval('customer_code_seq')").getSingleResult();
        return "CUST-%06d".formatted(next.longValue());
    }
}
