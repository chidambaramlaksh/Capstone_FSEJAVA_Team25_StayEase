package com.example.mmt.hotel;

import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.room.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HotelService {
    private final HotelRepository hotels;
    private final RoomRepository rooms;

    public HotelService(HotelRepository hotels, RoomRepository rooms) {
        this.hotels = hotels;
        this.rooms = rooms;
    }

    @Transactional(readOnly = true)
    public List<HotelResponse> findAll(String city) {
        List<Hotel> results = city == null || city.isBlank()
                ? hotels.findAll()
                : hotels.findByCityIgnoreCase(city.trim());
        return results.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Hotel getEntity(Long id) {
        return hotels.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel " + id + " was not found"));
    }

    @Transactional(readOnly = true)
    public HotelResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional
    public HotelResponse create(HotelRequest request) {
        return toResponse(hotels.save(new Hotel(request.name(), request.address(), request.city())));
    }

    @Transactional
    public HotelResponse update(Long id, HotelRequest request) {
        Hotel hotel = getEntity(id);
        hotel.update(request.name(), request.address(), request.city());
        return toResponse(hotel);
    }

    @Transactional
    public void delete(Long id) {
        hotels.delete(getEntity(id));
    }

    private HotelResponse toResponse(Hotel hotel) {
        return HotelResponse.from(hotel, rooms.findByHotelId(hotel.getId()).stream()
                .map(HotelRoomResponse::from).toList());
    }
}
