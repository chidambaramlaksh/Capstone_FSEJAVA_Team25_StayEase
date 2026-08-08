package com.example.mmt.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record BookingResponse(Long id, String bookingRef, Long guestId, Long roomId,
                              Long hotelId, String hotelName, String guestEmail,
                              LocalDate checkInDate, LocalDate checkOutDate,
                              BookingStatus status, BigDecimal totalPrice, Instant createdAt) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(), booking.getBookingRef(), booking.getGuest().getId(),
                booking.getRoom().getId(), booking.getRoom().getHotel().getId(),
                booking.getRoom().getHotel().getName(), booking.getGuest().getEmail(),
                booking.getCheckInDate(), booking.getCheckOutDate(), booking.getStatus(),
                booking.getTotalPrice(), booking.getCreatedAt());
    }
}
