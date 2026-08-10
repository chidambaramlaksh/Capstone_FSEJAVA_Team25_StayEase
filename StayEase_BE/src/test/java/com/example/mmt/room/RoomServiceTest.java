package com.example.mmt.room;

import com.example.mmt.TestFixtures;
import com.example.mmt.common.BadRequestException;
import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.hotel.Hotel;
import com.example.mmt.hotel.HotelRepository;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {
    @Mock private RoomRepository rooms;
    @Mock private HotelRepository hotels;
    @InjectMocks private RoomService service;

    @Test void findByHotelMapsRoomsAndRequiresExistingHotel() {
        Hotel hotel = hotel(1L);
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(rooms.findByHotelId(1L)).thenReturn(List.of(room(2L, hotel, 2)));
        assertEquals("101", service.findByHotel(1L).get(0).roomNumber());
        when(hotels.findById(3L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.findByHotel(3L));
        verify(rooms, never()).findByHotelId(3L);
    }

    @Test void findAvailableValidatesDatesAndReturnsEmptyResult() {
        Hotel hotel = hotel(1L);
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(rooms.findAvailable(1L)).thenReturn(List.of());
        assertTrue(service.findAvailable(1L, LocalDate.now(), LocalDate.now().plusDays(1)).isEmpty());
        assertThrows(BadRequestException.class, () -> service.findAvailable(1L, null, LocalDate.now().plusDays(1)));
        assertThrows(BadRequestException.class, () -> service.findAvailable(1L, LocalDate.now(), LocalDate.now()));
        assertThrows(BadRequestException.class, () -> service.findAvailable(1L, LocalDate.now().minusDays(1), LocalDate.now().plusDays(1)));
    }

    @Test void createUsesDefaultsAndSavesForAssignedManager() {
        Hotel hotel = hotel(1L);
        AppUser manager = manager(1L);
        RoomRequest request = new RoomRequest("202", RoomType.DOUBLE, new BigDecimal("99.99"), null, "d", "image", null, null);
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(rooms.save(any(Room.class))).thenAnswer(i -> TestFixtures.withId(i.getArgument(0), 2L));
        RoomResponse result = service.create(1L, request, manager);
        assertAll(() -> assertEquals(2L, result.id()), () -> assertEquals(1, result.available()), () -> assertEquals(3, result.maxOccupancy()), () -> assertEquals("image", result.imageUrl()));
        verify(rooms).save(any(Room.class));
    }

    @Test void createRejectsUnauthorizedManagerAndMissingHotelAndPropagatesSaveFailure() {
        RoomRequest request = new RoomRequest("202", RoomType.DOUBLE, BigDecimal.ONE, 2, null, null, true, 1);
        assertThrows(AccessDeniedException.class, () -> service.create(1L, request, new AppUser("u", "u@e.com", "U", "p", Role.USER, null)));
        when(hotels.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.create(1L, request, manager(1L)));
        Hotel hotel = hotel(1L);
        when(hotels.findById(1L)).thenReturn(Optional.of(hotel));
        when(rooms.save(any())).thenThrow(new IllegalStateException("write failed"));
        assertThrows(IllegalStateException.class, () -> service.create(1L, request, manager(1L)));
    }

    @Test void updateChangesFieldsAndRespectsManagerOwnership() {
        Hotel hotel = hotel(1L); Room room = room(2L, hotel, 1);
        when(rooms.findById(2L)).thenReturn(Optional.of(room));
        RoomRequest request = new RoomRequest("303", RoomType.SUITE, new BigDecimal("200"), 4, "new", "new-image", false, 0);
        RoomResponse result = service.update(2L, request, manager(1L));
        assertAll(() -> assertEquals("303", result.roomNumber()), () -> assertFalse(result.active()), () -> assertEquals(0, result.available()), () -> assertEquals(4, result.maxOccupancy()));
        assertThrows(AccessDeniedException.class, () -> service.update(2L, request, manager(99L)));
    }

    @Test void deleteToggleAndGetEntityCoverSuccessAndNotFound() {
        Hotel hotel = hotel(1L); Room room = room(2L, hotel, 1);
        when(rooms.findById(2L)).thenReturn(Optional.of(room));
        service.delete(2L, manager(1L));
        verify(rooms).delete(room);
        assertTrue(service.toggleStatus(2L, manager(1L)).active() == false);
        when(rooms.findById(3L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getEntity(3L));
    }

    private Hotel hotel(Long id) { return TestFixtures.withId(new Hotel("H", "A", "C"), id); }
    private Room room(Long id, Hotel hotel, int available) { return TestFixtures.withId(new Room(hotel, "101", RoomType.SINGLE, "d", BigDecimal.TEN, available, 2), id); }
    private AppUser manager(Long hotelId) { return TestFixtures.withId(new AppUser("manager", "m@example.com", "M", "p", Role.HOTEL_MANAGER, hotelId), 8L); }
}
