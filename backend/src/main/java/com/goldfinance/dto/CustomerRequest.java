package com.goldfinance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Phone number must be 7 to 20 digits or symbols") String phoneNumber,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,20}$", message = "Alternative phone must be 7 to 20 digits or symbols") String alternativePhone,
        @NotBlank @Size(max = 500) String address,
        @NotBlank @Size(max = 80) String governmentIdNumber
) {
}

