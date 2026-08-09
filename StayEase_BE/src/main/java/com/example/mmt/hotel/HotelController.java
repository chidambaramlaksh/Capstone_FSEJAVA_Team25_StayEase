package com.example.mmt.hotel;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {
    private final HotelService hotels;

    public HotelController(HotelService hotels) {
        this.hotels = hotels;
    }

    @GetMapping
    public List<HotelResponse> list(@RequestParam(required = false) String city) {
        return hotels.findAll(city);
    }

    @GetMapping("/{hotelId}")
    public HotelResponse get(@PathVariable Long hotelId) {
        return hotels.findById(hotelId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public AdminHotelResponse create(@Valid @RequestBody HotelRequest request) {
        return hotels.create(request);
    }

    @GetMapping("/admin/directory")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminHotelResponse> adminDirectory() {
        return hotels.findAllForAdmin();
    }

    @PutMapping("/{hotelId}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminHotelResponse update(@PathVariable Long hotelId, @Valid @RequestBody HotelRequest request) {
        return hotels.update(hotelId, request);
    }

    @DeleteMapping("/{hotelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long hotelId) {
        hotels.delete(hotelId);
    }
}
