package com.goldfinance.service;

import com.goldfinance.dto.CustomerRequest;
import com.goldfinance.dto.CustomerResponse;
import com.goldfinance.dto.LoanResponse;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.exception.BusinessException;
import com.goldfinance.exception.ResourceNotFoundException;
import com.goldfinance.mapper.CustomerMapper;
import com.goldfinance.mapper.LoanMapper;
import com.goldfinance.repository.CustomerRepository;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.util.LoanNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final LoanRepository loanRepository;
    private final CustomerMapper customerMapper;
    private final LoanMapper loanMapper;
    private final LoanNumberGenerator numberGenerator;
    private final AuditService auditService;

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByPhoneNumber(request.phoneNumber())) {
            throw new BusinessException("A customer with this phone number already exists");
        }
        var customer = customerMapper.toEntity(request);
        customer.setCustomerCode(numberGenerator.nextCustomerCode());
        var saved = customerRepository.save(customer);
        auditService.record("CREATE", "Customer", saved.getId(), "Created customer " + saved.getCustomerCode());
        return customerMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public CustomerResponse get(Long id) {
        return customerMapper.toResponse(findCustomer(id));
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        var customer = findCustomer(id);
        customerMapper.update(request, customer);
        auditService.record("UPDATE", "Customer", id, "Updated customer " + customer.getCustomerCode());
        return customerMapper.toResponse(customer);
    }

    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> search(String query, Pageable pageable) {
        var page = (query == null || query.isBlank())
                ? customerRepository.findAll(pageable)
                : customerRepository.search(query.trim(), pageable);
        return PageResponse.from(page.map(customerMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> loanHistory(Long customerId) {
        findCustomer(customerId);
        return loanRepository.findByCustomerIdOrderByLoanDateDesc(customerId).stream()
                .map(loanMapper::toResponse)
                .toList();
    }

    private com.goldfinance.entity.Customer findCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }
}

