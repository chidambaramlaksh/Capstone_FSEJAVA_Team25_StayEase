package com.example.mmt.booking;

import com.example.mmt.common.BadRequestException;
import com.example.mmt.common.ResourceNotFoundException;
import com.example.mmt.room.Room;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.user.AppUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookings;
    private final RoomRepository rooms;

    public BookingService(BookingRepository bookings, RoomRepository rooms) {
        this.bookings = bookings;
        this.rooms = rooms;
    }

    @Transactional
    public BookingResponse create(BookingRequest request, AppUser user) {
        validateDates(request.checkInDate(), request.checkOutDate());
        Room room = rooms.findById(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room " + request.roomId() + " was not found"));

        room = rooms.findByIdForUpdate(room.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Room " + request.roomId() + " was not found"));
        if (!room.hasAvailability()) {
            throw new BadRequestException("No rooms are available in the selected category");
        }
        room.decrementAvailable();

        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        return BookingResponse.from(bookings.save(
                new Booking(user, room, request.checkInDate(), request.checkOutDate(), total)));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> findMine(AppUser user) {
        return bookings.findByGuestUsernameOrderByCreatedAtDesc(user.getUsername())
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional
    public void cancel(Long bookingId, AppUser user) {
        Booking booking = bookings.findByIdForUpdate(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking " + bookingId + " was not found"));
        if (!booking.getGuest().getId().equals(user.getId())) {
            throw new BadRequestException("You can cancel only your own bookings");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        Room room = rooms.findByIdForUpdate(booking.getRoom().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Room " + booking.getRoom().getId() + " was not found"));
        booking.cancel();
        room.incrementAvailable();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> upcomingForManager(AppUser manager) {
        if (manager.getManagedHotelId() == null) {
            throw new BadRequestException("Manager is not assigned to a hotel");
        }
        return bookings.findUpcomingForManager(manager.getId(), manager.getManagedHotelId(),
                        BookingStatus.BOOKED, LocalDate.now())
                .stream().map(BookingResponse::from).toList();
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (!checkIn.isBefore(checkOut) || checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("checkIn must be today or later and before checkOut");
        }
    }
}
