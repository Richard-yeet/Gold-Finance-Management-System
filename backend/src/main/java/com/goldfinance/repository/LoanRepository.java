package com.goldfinance.repository;

import com.goldfinance.entity.Loan;
import com.goldfinance.entity.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    @EntityGraph(attributePaths = {"customer", "jewelleryItems"})
    Optional<Loan> findDetailedById(Long id);

    @EntityGraph(attributePaths = {"customer", "jewelleryItems", "payments"})
    Optional<Loan> findByLoanNumber(String loanNumber);

    List<Loan> findByCustomerIdOrderByLoanDateDesc(Long customerId);

    long countByStatus(LoanStatus status);

    List<Loan> findTop8ByOrderByCreatedAtDesc();

    List<Loan> findByStatusAndLoanDateBefore(LoanStatus status, LocalDate before);

    @Query("select coalesce(sum(l.outstandingPrincipal), 0) from Loan l where l.status = :status")
    BigDecimal sumOutstandingPrincipal(@Param("status") LoanStatus status);

    @Query("select coalesce(sum(l.outstandingInterest), 0) from Loan l where l.status = :status")
    BigDecimal sumOutstandingInterest(@Param("status") LoanStatus status);

    @Query("""
            select l from Loan l
            join l.customer c
            left join l.jewelleryItems i
            where lower(l.loanNumber) like lower(concat('%', :query, '%'))
               or lower(c.name) like lower(concat('%', :query, '%'))
               or c.phoneNumber like concat('%', :query, '%')
               or lower(i.description) like lower(concat('%', :query, '%'))
               or lower(i.lockerNumber) like lower(concat('%', :query, '%'))
            """)
    Page<Loan> search(@Param("query") String query, Pageable pageable);
}

