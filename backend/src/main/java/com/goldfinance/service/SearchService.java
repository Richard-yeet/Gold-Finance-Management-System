package com.goldfinance.service;

import com.goldfinance.dto.SearchResult;
import com.goldfinance.repository.CustomerRepository;
import com.goldfinance.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final CustomerRepository customerRepository;
    private final LoanRepository loanRepository;

    @Transactional(readOnly = true)
    public List<SearchResult> globalSearch(String query) {
        var results = new ArrayList<SearchResult>();
        var pageable = PageRequest.of(0, 10);
        customerRepository.search(query, pageable).forEach(customer -> results.add(new SearchResult(
                "CUSTOMER",
                customer.getId(),
                customer.getCustomerCode() + " - " + customer.getName(),
                customer.getPhoneNumber()
        )));
        loanRepository.search(query, pageable).forEach(loan -> results.add(new SearchResult(
                "LOAN",
                loan.getId(),
                loan.getLoanNumber(),
                loan.getCustomer().getName() + " | Outstanding " + loan.getOutstandingAmount()
        )));
        return results;
    }
}

