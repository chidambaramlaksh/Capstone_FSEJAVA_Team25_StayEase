package com.example.mmt.booking;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByGuestUsernameOrderByCreatedAtDesc(String username);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Booking b where b.id = :bookingId")
    Optional<Booking> findByIdForUpdate(@Param("bookingId") Long bookingId);

    @Query("""
            select b from Booking b where b.room.hotel.id = :hotelId
            and b.status = :status and b.checkOutDate >= :today
            order by b.checkInDate asc
            """)
    List<Booking> findUpcomingForHotel(@Param("hotelId") Long hotelId,
                                       @Param("status") BookingStatus status,
                                       @Param("today") LocalDate today);
}
