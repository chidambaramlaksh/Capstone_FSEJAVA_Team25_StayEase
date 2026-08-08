package com.example.mmt.auth;

public record AuthResponse(Long userId, String token, String email, String name, String role, Long managedHotelId) {
}
