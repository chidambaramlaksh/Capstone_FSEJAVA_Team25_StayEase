package com.example.mmt.hotel;

import com.example.mmt.booking.BookingRepository;
import com.example.mmt.common.BadRequestException;
import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.room.Room;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.room.RoomType;
import com.example.mmt.user.AppUserRepository;
import com.example.mmt.user.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HotelService {
    private static final BigDecimal DEFAULT_SINGLE_PRICE = new BigDecimal("8500");
    private static final BigDecimal DEFAULT_DOUBLE_PRICE = new BigDecimal("11200");
    private static final BigDecimal DEFAULT_SUITE_PRICE = new BigDecimal("16900");

    private final HotelRepository hotels;
    private final RoomRepository rooms;
    private final BookingRepository bookings;
    private final AppUserRepository users;

    public HotelService(HotelRepository hotels, RoomRepository rooms, BookingRepository bookings,
                        AppUserRepository users) {
        this.hotels = hotels;
        this.rooms = rooms;
        this.bookings = bookings;
        this.users = users;
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
    public AdminHotelResponse create(HotelRequest request) {
        Long defaultManagerId = users.findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER)
                .orElseThrow(() -> new BadRequestException("No hotel manager is available for this hotel"))
                .getId();
        Hotel hotel = new Hotel(request.name(), request.city(), request.city(), request.description(),
                request.coverImageUrl(), request.starRating(), DEFAULT_SINGLE_PRICE);
        // Keep the manager's primary managedHotelId unchanged so existing room management is unaffected.
        hotel.assignManager(defaultManagerId);
        Hotel savedHotel = hotels.save(hotel);
        rooms.saveAll(List.of(
                defaultRoom(savedHotel, "101", RoomType.SINGLE,
                        "A comfortable room for one guest.", DEFAULT_SINGLE_PRICE, 3),
                defaultRoom(savedHotel, "201", RoomType.DOUBLE,
                        "A spacious room designed for two guests.", DEFAULT_DOUBLE_PRICE, 3),
                defaultRoom(savedHotel, "301", RoomType.SUITE,
                        "A premium suite with extra space to unwind.", DEFAULT_SUITE_PRICE, 2)
        ));
        return AdminHotelResponse.from(savedHotel);
    }

    @Transactional
    public AdminHotelResponse update(Long id, HotelRequest request) {
        Hotel hotel = getEntity(id);
        hotel.updateAdminDetails(request.name(), request.city(), request.description(),
                request.coverImageUrl(), request.starRating());
        return AdminHotelResponse.from(hotel);
    }

    @Transactional
    public void delete(Long id) {
        Hotel hotel = getEntity(id);
        if (bookings.existsByRoom_Hotel_Id(id)) {
            throw new BadRequestException("A hotel with bookings cannot be deleted");
        }
        if (hotel.getManagerId() != null) {
            users.findById(hotel.getManagerId()).ifPresent(manager ->
                    manager.setManagedHotelId(null));
        }
        rooms.deleteAll(rooms.findByHotelId(id));
        hotels.delete(hotel);
    }

    @Transactional(readOnly = true)
    public List<AdminHotelResponse> findAllForAdmin() {
        return hotels.findAll().stream().map(AdminHotelResponse::from).toList();
    }

    private HotelResponse toResponse(Hotel hotel) {
        return HotelResponse.from(hotel, rooms.findByHotelId(hotel.getId()).stream()
                .map(HotelRoomResponse::from).toList());
    }

    private Room defaultRoom(Hotel hotel, String roomNumber, RoomType type, String description,
                             BigDecimal pricePerNight, int maxOccupancy) {
        Room room = new Room(hotel, roomNumber, type, description, pricePerNight, 3, maxOccupancy);
        room.setImageUrl(hotel.getImage());
        return room;
    }

}
