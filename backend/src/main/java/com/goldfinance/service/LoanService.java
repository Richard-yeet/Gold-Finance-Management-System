package com.goldfinance.service;

import com.goldfinance.dto.LoanCreateRequest;
import com.goldfinance.dto.LoanResponse;
import com.goldfinance.dto.LoanUpdateRequest;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.entity.Loan;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.exception.BusinessException;
import com.goldfinance.exception.ResourceNotFoundException;
import com.goldfinance.mapper.JewelleryItemMapper;
import com.goldfinance.mapper.LoanMapper;
import com.goldfinance.repository.CustomerRepository;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.util.LoanNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final JewelleryItemMapper jewelleryItemMapper;
    private final LoanMapper loanMapper;
    private final LoanNumberGenerator numberGenerator;
    private final LoanAccountingService accountingService;
    private final AuditService auditService;

    @Transactional
    public LoanResponse create(LoanCreateRequest request) {
        var customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        var loan = Loan.builder()
                .loanNumber(numberGenerator.nextLoanNumber())
                .customer(customer)
                .principalAmount(request.principalAmount())
                .interestRate(request.interestRate())
                .interestType(request.interestType())
                .interestPaymentFrequency(request.interestPaymentFrequency())
                .loanDate(request.loanDate())
                .status(LoanStatus.ACTIVE)
                .outstandingPrincipal(request.principalAmount())
                .outstandingInterest(BigDecimal.ZERO)
                .outstandingAmount(request.principalAmount())
                .notes(request.notes())
                .build();

        request.jewelleryItems().forEach(itemRequest -> loan.addJewelleryItem(jewelleryItemMapper.toEntity(itemRequest)));
        accountingService.refreshOutstanding(loan, LocalDate.now());
        var saved = loanRepository.save(loan);
        auditService.record("CREATE", "Loan", saved.getId(), "Created loan " + saved.getLoanNumber());
        return loanMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public LoanResponse get(Long id) {
        return loanMapper.toResponse(findDetailedLoan(id));
    }

    @Transactional(readOnly = true)
    public PageResponse<LoanResponse> list(String query, Pageable pageable) {
        var page = query == null || query.isBlank()
                ? loanRepository.findAll(pageable)
                : loanRepository.search(query.trim(), pageable);
        return PageResponse.from(page.map(loanMapper::toResponse));
    }

    @Transactional
    public LoanResponse update(Long id, LoanUpdateRequest request) {
        var loan = findDetailedLoan(id);
        loan.setInterestRate(request.interestRate());
        loan.setInterestType(request.interestType());
        loan.setInterestPaymentFrequency(request.interestPaymentFrequency());
        loan.setStatus(request.status());
        loan.setNotes(request.notes());
        accountingService.refreshOutstanding(loan, LocalDate.now());
        auditService.record("UPDATE", "Loan", id, "Updated loan " + loan.getLoanNumber());
        return loanMapper.toResponse(loan);
    }

    @Transactional
    public LoanResponse close(Long id) {
        var loan = findDetailedLoan(id);
        accountingService.refreshOutstanding(loan, LocalDate.now());
        if (loan.getOutstandingAmount().compareTo(new BigDecimal("0.01")) > 0) {
            throw new BusinessException("Loan cannot be closed until principal and interest are settled");
        }
        loan.setStatus(LoanStatus.CLOSED);
        loan.setClosedDate(LocalDate.now());
        auditService.record("CLOSE", "Loan", id, "Closed loan " + loan.getLoanNumber());
        return loanMapper.toResponse(loan);
    }

    @Transactional
    public LoanResponse renew(Long id) {
        var loan = findDetailedLoan(id);
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new BusinessException("Only active loans can be renewed");
        }
        if (loan.getOutstandingInterest().compareTo(BigDecimal.ZERO) > 0) {
            throw new BusinessException(
                    "Outstanding interest must be paid before renewal");
        }
        loan.setNotes((loan.getNotes() == null ? "" : loan.getNotes() + "\n") + "Renewed on " + LocalDate.now());
        accountingService.refreshOutstanding(loan, LocalDate.now());
        auditService.record("RENEW", "Loan", id, "Renewed loan " + loan.getLoanNumber());
        return loanMapper.toResponse(loan);
    }

    Loan findDetailedLoan(Long id) {
        return loanRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));
    }
}

