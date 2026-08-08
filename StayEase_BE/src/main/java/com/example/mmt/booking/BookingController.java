package com.example.mmt.booking;

import com.example.mmt.user.AppUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {
    private final BookingService bookings;

    public BookingController(BookingService bookings) {
        this.bookings = bookings;
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('USER')")
    public BookingResponse create(@Valid @RequestBody BookingRequest request,
                                  @AuthenticationPrincipal AppUser user) {
        return bookings.create(request, user);
    }

    @GetMapping("/bookings/me")
    @PreAuthorize("hasRole('USER')")
    public List<BookingResponse> mine(@AuthenticationPrincipal AppUser user) {
        return bookings.findMine(user);
    }

    @PutMapping("/bookings/{bookingId}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('USER')")
    public void cancel(@PathVariable Long bookingId, @AuthenticationPrincipal AppUser user) {
        bookings.cancel(bookingId, user);
    }

    @GetMapping("/manager/bookings/upcoming")
    @PreAuthorize("hasRole('HOTEL_MANAGER')")
    public List<BookingResponse> upcoming(@AuthenticationPrincipal AppUser manager) {
        return bookings.upcomingForManager(manager);
    }
}
