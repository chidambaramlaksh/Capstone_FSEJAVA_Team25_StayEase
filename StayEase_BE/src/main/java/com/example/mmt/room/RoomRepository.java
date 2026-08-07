package com.example.mmt.room;

import com.example.mmt.booking.Booking;
import com.example.mmt.booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);

    @Query("""
            select r from Room r where r.hotel.id = :hotelId and r.active = true
            and not exists (select b from Booking b
              where b.room.id = r.id and b.status <> :cancelledStatus
                and b.checkInDate < :checkOut and b.checkOutDate > :checkIn)
            """)
    List<Room> findAvailable(@Param("hotelId") Long hotelId,
                             @Param("checkIn") LocalDate checkIn,
                             @Param("checkOut") LocalDate checkOut,
                             @Param("cancelledStatus") BookingStatus cancelledStatus);
}
