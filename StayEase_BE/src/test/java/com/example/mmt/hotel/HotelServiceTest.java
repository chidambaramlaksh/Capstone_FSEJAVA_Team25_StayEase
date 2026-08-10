package com.example.mmt.hotel;

import com.example.mmt.TestFixtures;
import com.example.mmt.booking.BookingRepository;
import com.example.mmt.common.BadRequestException;
import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.room.Room;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.room.RoomType;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.AppUserRepository;
import com.example.mmt.user.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {
    @Mock private HotelRepository hotels;
    @Mock private RoomRepository rooms;
    @Mock private BookingRepository bookings;
    @Mock private AppUserRepository users;
    @InjectMocks private HotelService service;

    @Test void findAllUsesAllForBlankCityAndTrimsCityFilter() {
        Hotel hotel = hotel(1L, "Pune");
        when(hotels.findAll()).thenReturn(List.of(hotel));
        when(rooms.findByHotelId(1L)).thenReturn(List.of());
        assertEquals(1, service.findAll(" ").size());
        verify(hotels).findAll();
        when(hotels.findByCityIgnoreCase("Pune")).thenReturn(List.of(hotel));
        assertEquals("Pune", service.findAll(" Pune ").get(0).city());
        verify(hotels).findByCityIgnoreCase("Pune");
    }

    @Test void getEntityAndFindByIdReturnOrThrowForMissingHotel() {
        Hotel hotel = hotel(1L, "Pune");
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(rooms.findByHotelId(1L)).thenReturn(List.of(room(hotel)));
        assertSame(hotel, service.getEntity(1L));
        assertEquals(1, service.findById(1L).rooms().size());
        when(hotels.findById(9L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.findById(9L));
    }

    @Test void createAssignsFirstManagerAndCreatesThreeDefaultRooms() {
        AppUser manager = TestFixtures.withId(new AppUser("m", "m@example.com", "M", "p", Role.HOTEL_MANAGER, 88L), 6L);
        HotelRequest request = request("Pune");
        when(users.findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER)).thenReturn(Optional.of(manager));
        when(hotels.save(any(Hotel.class))).thenAnswer(i -> TestFixtures.withId(i.getArgument(0), 2L));
        when(rooms.saveAll(anyList())).thenAnswer(i -> i.getArgument(0));
        AdminHotelResponse result = service.create(request);
        assertAll(() -> assertEquals(2L, result.id()), () -> assertEquals("Pune", result.city()), () -> assertEquals("https://image", result.coverImageUrl()));
        ArgumentCaptor<List<Room>> roomsCaptor = ArgumentCaptor.forClass(List.class);
        verify(rooms).saveAll(roomsCaptor.capture());
        assertAll(() -> assertEquals(3, roomsCaptor.getValue().size()), () -> assertEquals("101", roomsCaptor.getValue().get(0).getRoomNumber()), () -> assertEquals("https://image", roomsCaptor.getValue().get(0).getImageUrl()));
    }

    @Test void createRejectsMissingManagerAndPropagatesDependencyFailure() {
        when(users.findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER)).thenReturn(Optional.empty());
        assertThrows(BadRequestException.class, () -> service.create(request("Pune")));
        verify(hotels, never()).save(any());
        when(users.findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER)).thenThrow(new IllegalStateException("db down"));
        assertThrows(IllegalStateException.class, () -> service.create(request("Pune")));
    }

    @Test void updateChangesAdminDetailsAndFindAllForAdminMapsResults() {
        Hotel hotel = hotel(1L, "Old");
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        AdminHotelResponse updated = service.update(1L, request("New"));
        assertAll(() -> assertEquals("New", updated.city()), () -> assertEquals("New", hotel.getAddress()));
        when(hotels.findAll()).thenReturn(List.of(hotel));
        assertEquals(1, service.findAllForAdmin().size());
    }

    @Test void deleteRemovesRoomsAndHotelAndClearsAssignedManager() {
        Hotel hotel = hotel(1L, "Pune"); hotel.assignManager(6L);
        AppUser manager = TestFixtures.withId(new AppUser("m", "m@example.com", "M", "p", Role.HOTEL_MANAGER, 1L), 6L);
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(bookings.existsByRoom_Hotel_Id(1L)).thenReturn(false);
        when(users.findById(6L)).thenReturn(Optional.of(manager));
        when(rooms.findByHotelId(1L)).thenReturn(List.of(room(hotel)));
        service.delete(1L);
        assertNull(manager.getManagedHotelId());
        verify(rooms).deleteAll(anyList());
        verify(hotels).delete(hotel);
    }

    @Test void deleteRejectsHotelWithBookingsAndMissingHotel() {
        Hotel hotel = hotel(1L, "Pune");
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(bookings.existsByRoom_Hotel_Id(1L)).thenReturn(true);
        assertThrows(BadRequestException.class, () -> service.delete(1L));
        verify(hotels, never()).delete(any());
        when(hotels.findById(2L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.delete(2L));
    }

    private HotelRequest request(String city) { return new HotelRequest("Hotel", city, new BigDecimal("4.5"), "Description", "https://image"); }
    private Hotel hotel(Long id, String city) { return TestFixtures.withId(new Hotel("Hotel", city, city, "Description", "https://image", new BigDecimal("4.5"), BigDecimal.TEN), id); }
    private Room room(Hotel hotel) { return TestFixtures.withId(new Room(hotel, "101", RoomType.SINGLE, "d", BigDecimal.TEN, 1, 2), 4L); }
}
