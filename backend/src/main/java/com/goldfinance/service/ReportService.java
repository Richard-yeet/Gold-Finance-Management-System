package com.goldfinance.service;

import com.goldfinance.dto.ReportSummary;
import com.goldfinance.entity.LoanStatus;
import com.goldfinance.repository.BankLoanRepository;
import com.goldfinance.repository.LoanRepository;
import com.goldfinance.repository.PaymentRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;
    private final BankLoanRepository bankLoanRepository;

    @Transactional(readOnly = true)
    public ReportSummary summary(LocalDate from, LocalDate to) {
        var payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateAsc(from, to);
        BigDecimal total = payments.stream().map(payment -> payment.getAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new ReportSummary(
                from,
                to,
                total,
                paymentRepository.sumInterestBetween(from, to),
                loanRepository.countByStatus(LoanStatus.ACTIVE),
                loanRepository.countByStatus(LoanStatus.CLOSED),
                bankLoanRepository.count()
        );
    }

    @Transactional(readOnly = true)
    public byte[] exportCollections(LocalDate from, LocalDate to, String format) {
        var payments = paymentRepository.findByPaymentDateBetweenOrderByPaymentDateAsc(from, to);
        return switch (format.toLowerCase()) {
            case "xlsx" -> toExcel(payments);
            case "pdf" -> toPdf(payments, from, to);
            default -> toCsv(payments).getBytes();
        };
    }

    public String contentType(String format) {
        return switch (format.toLowerCase()) {
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "pdf" -> "application/pdf";
            default -> "text/csv";
        };
    }

    public String extension(String format) {
        return switch (format.toLowerCase()) {
            case "xlsx" -> "xlsx";
            case "pdf" -> "pdf";
            default -> "csv";
        };
    }

    private String toCsv(java.util.List<com.goldfinance.entity.Payment> payments) {
        var builder = new StringBuilder("Receipt,Loan,Date,Type,Amount,Principal,Interest\n");
        payments.forEach(payment -> builder.append(String.join(",",
                payment.getReceiptNumber(),
                payment.getLoan().getLoanNumber(),
                payment.getPaymentDate().toString(),
                payment.getPaymentType().name(),
                payment.getAmount().toPlainString(),
                payment.getPrincipalComponent().toPlainString(),
                payment.getInterestComponent().toPlainString()
        )).append('\n'));
        return builder.toString();
    }

    private byte[] toExcel(java.util.List<com.goldfinance.entity.Payment> payments) {
        try (var workbook = new XSSFWorkbook(); var output = new ByteArrayOutputStream()) {
            var sheet = workbook.createSheet("Collections");
            var header = sheet.createRow(0);
            String[] columns = {"Receipt", "Loan", "Date", "Type", "Amount", "Principal", "Interest"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }
            for (int i = 0; i < payments.size(); i++) {
                var payment = payments.get(i);
                var row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(payment.getReceiptNumber());
                row.createCell(1).setCellValue(payment.getLoan().getLoanNumber());
                row.createCell(2).setCellValue(payment.getPaymentDate().toString());
                row.createCell(3).setCellValue(payment.getPaymentType().name());
                row.createCell(4).setCellValue(payment.getAmount().doubleValue());
                row.createCell(5).setCellValue(payment.getPrincipalComponent().doubleValue());
                row.createCell(6).setCellValue(payment.getInterestComponent().doubleValue());
            }
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(output);
            return output.toByteArray();
        } catch (Exception ex) {
            throw new com.goldfinance.exception.BusinessException("Excel export failed: " + ex.getMessage());
        }
    }

    private byte[] toPdf(java.util.List<com.goldfinance.entity.Payment> payments, LocalDate from, LocalDate to) {
        try (var output = new ByteArrayOutputStream()) {
            var document = new Document();
            PdfWriter.getInstance(document, output);
            document.open();
            document.add(new Paragraph("Daily Collections Report"));
            document.add(new Paragraph("From " + from + " to " + to));
            var table = new PdfPTable(5);
            table.addCell("Receipt");
            table.addCell("Loan");
            table.addCell("Date");
            table.addCell("Amount");
            table.addCell("Interest");
            payments.forEach(payment -> {
                table.addCell(payment.getReceiptNumber());
                table.addCell(payment.getLoan().getLoanNumber());
                table.addCell(payment.getPaymentDate().toString());
                table.addCell(payment.getAmount().toPlainString());
                table.addCell(payment.getInterestComponent().toPlainString());
            });
            document.add(table);
            document.close();
            return output.toByteArray();
        } catch (Exception ex) {
            throw new com.goldfinance.exception.BusinessException("PDF export failed: " + ex.getMessage());
        }
    }
}

