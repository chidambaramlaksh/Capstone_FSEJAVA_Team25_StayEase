package com.example.mmt.hotel;

import jakarta.validation.constraints.NotBlank;

public record HotelRequest(@NotBlank String name, @NotBlank String address, @NotBlank String city) {
}
