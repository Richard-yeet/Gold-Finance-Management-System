package com.goldfinance.service;

import com.goldfinance.dto.BankLoanRequest;
import com.goldfinance.dto.BankLoanResponse;
import com.goldfinance.dto.PageResponse;
import com.goldfinance.entity.BankLoanStatus;
import com.goldfinance.exception.ResourceNotFoundException;
import com.goldfinance.mapper.BankLoanMapper;
import com.goldfinance.repository.BankLoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BankLoanService {

    private final BankLoanRepository bankLoanRepository;
    private final BankLoanMapper bankLoanMapper;
    private final AuditService auditService;

    @Transactional
    public BankLoanResponse create(BankLoanRequest request) {
        var saved = bankLoanRepository.save(bankLoanMapper.toEntity(request));
        auditService.record("CREATE", "BankLoan", saved.getId(), "Created bank loan " + saved.getLoanNumber());
        return bankLoanMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public BankLoanResponse get(Long id) {
        return bankLoanMapper.toResponse(find(id));
    }

    @Transactional(readOnly = true)
    public PageResponse<BankLoanResponse> list(Pageable pageable) {
        return PageResponse.from(bankLoanRepository.findAll(pageable).map(bankLoanMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public List<BankLoanResponse> renewalsWithin(int days) {
        return bankLoanRepository.findByStatusAndRenewalDateBetweenOrderByRenewalDateAsc(
                        BankLoanStatus.ACTIVE,
                        LocalDate.now(),
                        LocalDate.now().plusDays(days)
                ).stream()
                .map(bankLoanMapper::toResponse)
                .toList();
    }

    @Transactional
    public BankLoanResponse update(Long id, BankLoanRequest request) {
        var bankLoan = find(id);
        bankLoanMapper.update(request, bankLoan);
        auditService.record("UPDATE", "BankLoan", id, "Updated bank loan " + bankLoan.getLoanNumber());
        return bankLoanMapper.toResponse(bankLoan);
    }

    private com.goldfinance.entity.BankLoan find(Long id) {
        return bankLoanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank loan not found"));
    }
}

