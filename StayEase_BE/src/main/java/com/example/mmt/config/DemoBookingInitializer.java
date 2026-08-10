package com.example.mmt.config;

import com.example.mmt.booking.Booking;
import com.example.mmt.booking.BookingRepository;
import com.example.mmt.hotel.Hotel;
import com.example.mmt.hotel.HotelRepository;
import com.example.mmt.room.Room;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Configuration
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
public class DemoBookingInitializer {
    @Bean
    @Order(3)
    CommandLineRunner seedDemoBookings(BookingRepository bookings, HotelRepository hotels,
                                       RoomRepository rooms, AppUserRepository users) {
        return args -> {
            if (bookings.count() > 0) {
                return;
            }

            Hotel hotel = hotels.findAll().stream().findFirst().orElse(null);
            AppUser guest = users.findByEmail("user1@gmail.com").orElse(null);
            if (hotel == null || guest == null) {
                return;
            }

            List<Room> hotelRooms = rooms.findByHotelId(hotel.getId());
            if (hotelRooms.isEmpty()) {
                return;
            }

            LocalDate firstCheckIn = LocalDate.now().plusDays(2);
            createDemoBooking(bookings, guest, hotelRooms.get(0), firstCheckIn, firstCheckIn.plusDays(3));
            if (hotelRooms.size() > 1) {
                LocalDate secondCheckIn = LocalDate.now().plusDays(6);
                createDemoBooking(bookings, guest, hotelRooms.get(1), secondCheckIn, secondCheckIn.plusDays(2));
            }
            if (hotelRooms.size() > 2) {
                LocalDate thirdCheckIn = LocalDate.now().plusDays(12);
                createDemoBooking(bookings, guest, hotelRooms.get(2), thirdCheckIn, thirdCheckIn.plusDays(4));
            }
        };
    }

    private void createDemoBooking(BookingRepository bookings, AppUser guest, Room room,
                                   LocalDate checkIn, LocalDate checkOut) {
        if (!room.hasAvailability()) {
            return;
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        room.decrementAvailable();
        bookings.save(new Booking(guest, room, checkIn, checkOut, totalPrice));
    }
}
