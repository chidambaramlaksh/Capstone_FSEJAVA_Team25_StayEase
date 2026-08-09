package com.example.mmt.hotel;

import java.math.BigDecimal;

public record AdminHotelResponse(Long id, String name, String city, BigDecimal starRating,
                                 String description, String coverImageUrl) {
    public static AdminHotelResponse from(Hotel hotel) {
        return new AdminHotelResponse(hotel.getId(), hotel.getName(), hotel.getCity(),
                hotel.getRating(), hotel.getDescription(), hotel.getImage());
    }
}
