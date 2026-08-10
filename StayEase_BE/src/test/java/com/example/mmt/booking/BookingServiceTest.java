package com.example.mmt.booking;

import com.example.mmt.TestFixtures;
import com.example.mmt.common.BadRequestException;
import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.hotel.Hotel;
import com.example.mmt.room.Room;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.room.RoomType;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock private BookingRepository bookings;
    @Mock private RoomRepository rooms;
    @InjectMocks private BookingService service;

    @Test void createLocksRoomDecrementsAvailabilityAndCalculatesTotal() {
        AppUser guest = user(1L, Role.USER, null);
        Room room = room(9L, 2);
        BookingRequest request = new BookingRequest(9L, LocalDate.now(), LocalDate.now().plusDays(3));
        when(rooms.findById(9L)).thenReturn(Optional.of(room));
        when(rooms.findByIdForUpdate(9L)).thenReturn(Optional.of(room));
        when(bookings.save(any(Booking.class))).thenAnswer(invocation -> TestFixtures.withId(invocation.getArgument(0), 12L));

        BookingResponse result = service.create(request, guest);

        assertAll(() -> assertEquals(12L, result.id()), () -> assertEquals(new BigDecimal("300.00"), result.totalPrice()),
                () -> assertEquals(1, room.getAvailable()), () -> assertEquals(BookingStatus.BOOKED, result.status()));
        verify(rooms).findByIdForUpdate(9L);
        verify(bookings).save(any(Booking.class));
    }

    @Test void createRejectsInvalidDatesBeforeCallingDependencies() {
        BookingRequest request = new BookingRequest(9L, LocalDate.now().plusDays(2), LocalDate.now().plusDays(1));
        assertThrows(BadRequestException.class, () -> service.create(request, user(1L, Role.USER, null)));
        verifyNoInteractions(bookings, rooms);
    }

    @Test void createRejectsPastDatesAndMissingOrUnavailableRoom() {
        assertThrows(BadRequestException.class, () -> service.create(new BookingRequest(9L, LocalDate.now().minusDays(1), LocalDate.now().plusDays(1)), user(1L, Role.USER, null)));
        BookingRequest valid = new BookingRequest(9L, LocalDate.now(), LocalDate.now().plusDays(1));
        when(rooms.findById(9L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.create(valid, user(1L, Role.USER, null)));
        Room unavailable = room(9L, 0);
        when(rooms.findById(9L)).thenReturn(Optional.of(unavailable));
        when(rooms.findByIdForUpdate(9L)).thenReturn(Optional.of(unavailable));
        assertThrows(BadRequestException.class, () -> service.create(valid, user(1L, Role.USER, null)));
        verify(bookings, never()).save(any());
    }

    @Test void createPropagatesRepositoryFailureAndNullRequestFailsFast() {
        BookingRequest valid = new BookingRequest(9L, LocalDate.now(), LocalDate.now().plusDays(1));
        when(rooms.findById(9L)).thenThrow(new IllegalStateException("db down"));
        assertThrows(IllegalStateException.class, () -> service.create(valid, user(1L, Role.USER, null)));
        assertThrows(NullPointerException.class, () -> service.create(null, user(1L, Role.USER, null)));
    }

    @Test void findMineMapsBookingsAndHandlesEmptyResult() {
        AppUser guest = user(1L, Role.USER, null);
        Booking booking = booking(5L, guest, room(9L, 1));
        when(bookings.findByGuestUsernameOrderByCreatedAtDesc("guest1")).thenReturn(List.of(booking));
        assertEquals(1, service.findMine(guest).size());
        when(bookings.findByGuestUsernameOrderByCreatedAtDesc("guest2")).thenReturn(List.of());
        assertTrue(service.findMine(user(2L, Role.USER, null)).isEmpty());
    }

    @Test void cancelCancelsOwnBookingAndRestoresAvailability() {
        AppUser guest = user(1L, Role.USER, null);
        Room room = room(9L, 1);
        Booking booking = booking(5L, guest, room);
        when(bookings.findByIdForUpdate(5L)).thenReturn(Optional.of(booking));
        when(rooms.findByIdForUpdate(9L)).thenReturn(Optional.of(room));
        service.cancel(5L, guest);
        assertAll(() -> assertEquals(BookingStatus.CANCELLED, booking.getStatus()), () -> assertEquals(2, room.getAvailable()));
    }

    @Test void cancelRejectsMissingForeignAlreadyCancelledAndMissingRoom() {
        AppUser guest = user(1L, Role.USER, null);
        when(bookings.findByIdForUpdate(5L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.cancel(5L, guest));
        Booking foreign = booking(5L, user(2L, Role.USER, null), room(9L, 1));
        when(bookings.findByIdForUpdate(5L)).thenReturn(Optional.of(foreign));
        assertThrows(BadRequestException.class, () -> service.cancel(5L, guest));
        Booking cancelled = booking(5L, guest, room(9L, 1)); cancelled.cancel();
        when(bookings.findByIdForUpdate(5L)).thenReturn(Optional.of(cancelled));
        assertThrows(BadRequestException.class, () -> service.cancel(5L, guest));
        Booking normal = booking(5L, guest, room(9L, 1));
        when(bookings.findByIdForUpdate(5L)).thenReturn(Optional.of(normal));
        when(rooms.findByIdForUpdate(9L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.cancel(5L, guest));
    }

    @Test void upcomingForManagerValidatesAssignmentAndUsesCurrentDate() {
        AppUser manager = user(3L, Role.HOTEL_MANAGER, 4L);
        when(bookings.findUpcomingForManager(eq(3L), eq(4L), eq(BookingStatus.BOOKED), any(LocalDate.class))).thenReturn(List.of());
        assertTrue(service.upcomingForManager(manager).isEmpty());
        verify(bookings).findUpcomingForManager(eq(3L), eq(4L), eq(BookingStatus.BOOKED), eq(LocalDate.now()));
        assertThrows(BadRequestException.class, () -> service.upcomingForManager(user(3L, Role.HOTEL_MANAGER, null)));
    }

    private AppUser user(Long id, Role role, Long managedHotelId) {
        return TestFixtures.withId(new AppUser("guest" + id, "guest" + id + "@example.com", "Guest", "p", role, managedHotelId), id);
    }
    private Room room(Long id, int available) {
        Hotel hotel = TestFixtures.withId(new Hotel("H", "Address", "City"), 4L);
        return TestFixtures.withId(new Room(hotel, "101", RoomType.SINGLE, "desc", new BigDecimal("100.00"), available, 2), id);
    }
    private Booking booking(Long id, AppUser guest, Room room) {
        return TestFixtures.withId(new Booking(guest, room, LocalDate.now(), LocalDate.now().plusDays(1), new BigDecimal("100.00")), id);
    }
}
