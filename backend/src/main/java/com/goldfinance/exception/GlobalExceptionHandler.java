package com.goldfinance.exception;

import com.goldfinance.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiResponse<Object>> notFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.fail(ex.getMessage(), null));
    }

    @ExceptionHandler(BusinessException.class)
    ResponseEntity<ApiResponse<Object>> business(BusinessException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Map<String, String>>> validation(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage() == null ? "Invalid value" : fieldError.getDefaultMessage(),
                        (first, second) -> first
                ));
        return ResponseEntity.badRequest().body(ApiResponse.fail("Validation failed", errors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiResponse<Object>> denied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.fail("Access denied", null));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<Object>> unexpected(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail("Unexpected error: " + ex.getMessage(), null));
    }
}

