package com.example.mmt.hotel;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityIgnoreCase(String city);
}
