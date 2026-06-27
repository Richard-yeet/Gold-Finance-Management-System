package com.goldfinance.repository;

import com.goldfinance.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerCode(String customerCode);

    boolean existsByPhoneNumber(String phoneNumber);

    @Query("""
            select c from Customer c
            where lower(c.name) like lower(concat('%', :query, '%'))
               or lower(c.customerCode) like lower(concat('%', :query, '%'))
               or c.phoneNumber like concat('%', :query, '%')
               or coalesce(c.alternativePhone, '') like concat('%', :query, '%')
            """)
    Page<Customer> search(@Param("query") String query, Pageable pageable);
}

