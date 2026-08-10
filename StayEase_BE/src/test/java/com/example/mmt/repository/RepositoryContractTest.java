package com.example.mmt.repository;

import com.example.mmt.booking.BookingRepository;
import com.example.mmt.booking.BookingStatus;
import com.example.mmt.hotel.HotelRepository;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.user.AppUserRepository;
import com.example.mmt.user.Role;
import jakarta.persistence.LockModeType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.lang.reflect.Method;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit-level checks for Spring Data repository declarations. Query execution is
 * Spring Data infrastructure and is covered separately by application-level tests.
 */
@ExtendWith(MockitoExtension.class)
class RepositoryContractTest {
    @Mock private BookingRepository bookings;
    @Mock private HotelRepository hotels;
    @Mock private RoomRepository rooms;
    @Mock private AppUserRepository users;
    @InjectMocks private RepositoryCalls calls;

    @Test void repositoryMocksExposeEmptyAndOptionalResultsDeterministically() {
        when(bookings.findByGuestUsernameOrderByCreatedAtDesc("none")).thenReturn(List.of());
        when(hotels.findByCityIgnoreCase("nowhere")).thenReturn(List.of());
        when(rooms.findByIdForUpdate(99L)).thenReturn(Optional.empty());
        when(users.findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER)).thenReturn(Optional.empty());
        assertAll(() -> assertTrue(calls.bookingsFor("none").isEmpty()), () -> assertTrue(calls.hotelsIn("nowhere").isEmpty()),
                () -> assertTrue(calls.lockedRoom(99L).isEmpty()), () -> assertTrue(calls.firstManager().isEmpty()));
        verify(bookings).findByGuestUsernameOrderByCreatedAtDesc("none");
        verify(hotels).findByCityIgnoreCase("nowhere");
        verify(rooms).findByIdForUpdate(99L);
        verify(users).findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER);
    }

    @Test void lockingAndCustomQueryMethodsDeclareExpectedJpaMetadata() throws Exception {
        Method roomLock = RoomRepository.class.getMethod("findByIdForUpdate", Long.class);
        Method bookingLock = BookingRepository.class.getMethod("findByIdForUpdate", Long.class);
        Method available = RoomRepository.class.getMethod("findAvailable", Long.class);
        Method upcoming = BookingRepository.class.getMethod("findUpcomingForManager", Long.class, Long.class, BookingStatus.class, LocalDate.class);
        assertAll(
                () -> assertEquals(LockModeType.PESSIMISTIC_WRITE, roomLock.getAnnotation(Lock.class).value()),
                () -> assertEquals(LockModeType.PESSIMISTIC_WRITE, bookingLock.getAnnotation(Lock.class).value()),
                () -> assertTrue(available.getAnnotation(Query.class).value().contains("r.available > 0")),
                () -> assertTrue(upcoming.getAnnotation(Query.class).value().contains("b.checkOutDate >= :today")));
    }

    static class RepositoryCalls {
        private final BookingRepository bookings;
        private final HotelRepository hotels;
        private final RoomRepository rooms;
        private final AppUserRepository users;
        RepositoryCalls(BookingRepository bookings, HotelRepository hotels, RoomRepository rooms, AppUserRepository users) {
            this.bookings = bookings; this.hotels = hotels; this.rooms = rooms; this.users = users;
        }
        List<?> bookingsFor(String username) { return bookings.findByGuestUsernameOrderByCreatedAtDesc(username); }
        List<?> hotelsIn(String city) { return hotels.findByCityIgnoreCase(city); }
        Optional<?> lockedRoom(Long id) { return rooms.findByIdForUpdate(id); }
        Optional<?> firstManager() { return users.findFirstByRoleOrderByIdAsc(Role.HOTEL_MANAGER); }
    }
}
