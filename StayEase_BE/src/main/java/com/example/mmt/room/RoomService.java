package com.example.mmt.room;

import com.example.mmt.common.BadRequestException;
import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.hotel.Hotel;
import com.example.mmt.hotel.HotelRepository;
import com.example.mmt.user.AppUser;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository rooms;
    private final HotelRepository hotels;

    public RoomService(RoomRepository rooms, HotelRepository hotels) {
        this.rooms = rooms;
        this.hotels = hotels;
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> findByHotel(Long hotelId) {
        requireHotel(hotelId);
        return rooms.findByHotelId(hotelId).stream().map(RoomResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> findAvailable(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        validateDates(checkIn, checkOut);
        requireHotel(hotelId);
        return rooms.findAvailable(hotelId)
                .stream().map(RoomResponse::from).toList();
    }

    @Transactional
    public RoomResponse create(Long hotelId, RoomRequest request, AppUser manager) {
        assertManagerOwnsHotel(manager, hotelId);
        Hotel hotel = requireHotel(hotelId);
        int available = request.available() == null ? 1 : request.available();
        int maxOccupancy = request.maxOccupancy() == null ? 3 : request.maxOccupancy();
        Room room = new Room(hotel, request.roomNumber(), request.type(), request.description(),
                request.pricePerNight(), available, maxOccupancy);
        room.setImageUrl(request.imageUrl());
        return RoomResponse.from(rooms.save(room));
    }

    @Transactional
    public RoomResponse update(Long roomId, RoomRequest request, AppUser manager) {
        Room room = getEntity(roomId);
        assertManagerOwnsHotel(manager, room.getHotel().getId());
        boolean active = request.active() == null || request.active();
        room.update(request.roomNumber(), request.type(), request.pricePerNight(),
                active, request.available(), request.description(), request.imageUrl(), 
                request.maxOccupancy());
        return RoomResponse.from(room);
    }

    @Transactional
    public void delete(Long roomId, AppUser manager) {
        Room room = getEntity(roomId);
        assertManagerOwnsHotel(manager, room.getHotel().getId());
        rooms.delete(room);
    }

    @Transactional
    public RoomResponse toggleStatus(Long roomId, AppUser manager) {
        Room room = getEntity(roomId);
        assertManagerOwnsHotel(manager, room.getHotel().getId());
        room.toggleActive();
        return RoomResponse.from(room);
    }

    @Transactional(readOnly = true)
    public Room getEntity(Long roomId) {
        return rooms.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room " + roomId + " was not found"));
    }

    private Hotel requireHotel(Long hotelId) {
        return hotels.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel " + hotelId + " was not found"));
    }

    private void assertManagerOwnsHotel(AppUser manager, Long hotelId) {
        if (!manager.getRole().name().equals("HOTEL_MANAGER")
                || manager.getManagedHotelId() == null
                || !manager.getManagedHotelId().equals(hotelId)) {
            throw new AccessDeniedException("You can manage rooms only for your assigned hotel");
        }
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkIn.isBefore(checkOut)
                || checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("checkIn must be today or later and before checkOut");
        }
    }
}
