package com.example.mmt.hotel;

import com.example.mmt.room.Room;

import java.math.BigDecimal;

public record HotelRoomResponse(Long id, String category, String description, BigDecimal price,
                                int available, int maxOccupancy) {
    public static HotelRoomResponse from(Room room) {
        String category = room.getType().name().charAt(0)
                + room.getType().name().substring(1).toLowerCase();
        return new HotelRoomResponse(room.getId(), category, room.getDescription(),
                room.getPricePerNight(), room.getAvailable(), room.getMaxOccupancy());
    }
}
