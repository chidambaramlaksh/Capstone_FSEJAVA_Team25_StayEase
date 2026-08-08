package com.example.mmt.room;

public record RoomResponse(Long id, Long hotelId, String roomNumber, RoomType type,
                           java.math.BigDecimal pricePerNight, boolean active, int available) {
    public static RoomResponse from(Room room) {
        return new RoomResponse(room.getId(), room.getHotel().getId(), room.getRoomNumber(),
                room.getType(), room.getPricePerNight(), room.isActive(), room.getAvailable());
    }
}
