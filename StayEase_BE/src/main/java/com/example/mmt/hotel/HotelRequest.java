package com.example.mmt.hotel;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record HotelRequest(
        @NotBlank String name,
        @NotBlank String city,
        @NotNull @DecimalMin("1.0") @DecimalMax("5.0") BigDecimal starRating,
        @NotBlank String description,
        @NotBlank @Pattern(regexp = "https?://.+", message = "coverImageUrl must be a valid http(s) URL") String coverImageUrl) {
}
