package com.example.mmt.booking;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record BookingRequest(@NotNull Long roomId, @NotNull LocalDate checkInDate,
                             @NotNull LocalDate checkOutDate) {
}
