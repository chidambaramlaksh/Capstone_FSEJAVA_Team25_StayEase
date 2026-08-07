package com.example.mmt.hotel;

import java.math.BigDecimal;
import java.util.List;

public record HotelResponse(Long id, String name, String description, String city,
                            String image, BigDecimal rating, BigDecimal price,
                            List<HotelRoomResponse> rooms) {
    public static HotelResponse from(Hotel hotel, List<HotelRoomResponse> rooms) {
        return new HotelResponse(hotel.getId(), hotel.getName(), hotel.getDescription(),
                hotel.getCity(), hotel.getImage(), hotel.getRating(), hotel.getPrice(), rooms);
    }
}
