package com.example.mmt.room;

import com.example.mmt.user.AppUser;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RoomController {
    private final RoomService rooms;

    public RoomController(RoomService rooms) {
        this.rooms = rooms;
    }

    @GetMapping("/hotels/{hotelId}/rooms")
    public List<RoomResponse> list(@PathVariable Long hotelId) {
        return rooms.findByHotel(hotelId);
    }

    @GetMapping("/hotels/{hotelId}/availability")
    public List<RoomResponse> availability(
            @PathVariable Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return rooms.findAvailable(hotelId, checkIn, checkOut);
    }

    @PostMapping("/hotels/{hotelId}/rooms")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('HOTEL_MANAGER')")
    public RoomResponse create(@PathVariable Long hotelId, @Valid @RequestBody RoomRequest request,
                               @AuthenticationPrincipal AppUser manager) {
        return rooms.create(hotelId, request, manager);
    }

    @PutMapping("/rooms/{roomId}")
    @PreAuthorize("hasRole('HOTEL_MANAGER')")
    public RoomResponse update(@PathVariable Long roomId, @Valid @RequestBody RoomRequest request,
                               @AuthenticationPrincipal AppUser manager) {
        return rooms.update(roomId, request, manager);
    }

    @DeleteMapping("/rooms/{roomId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('HOTEL_MANAGER')")
    public void delete(@PathVariable Long roomId, @AuthenticationPrincipal AppUser manager) {
        rooms.delete(roomId, manager);
    }

    @PatchMapping("/rooms/{roomId}/status")
    @PreAuthorize("hasRole('HOTEL_MANAGER')")
    public RoomResponse toggleStatus(@PathVariable Long roomId, @AuthenticationPrincipal AppUser manager) {
        return rooms.toggleStatus(roomId, manager);
    }
}
