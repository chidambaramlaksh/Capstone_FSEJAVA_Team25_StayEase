package com.example.mmt.auth;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private final JwtService service = new JwtService("01234567890123456789012345678901", 60_000);

    @Test void generatedTokenExtractsUsernameAndValidatesForMatchingUser() {
        UserDetails ada = User.withUsername("ada@example.com").password("x").authorities("ROLE_USER").build();
        String token = service.generateToken(ada);
        assertAll(() -> assertEquals("ada@example.com", service.extractUsername(token)),
                () -> assertTrue(service.isTokenValid(token, ada)),
                () -> assertFalse(service.isTokenValid(token, User.withUsername("other").password("x").authorities("ROLE_USER").build())));
    }

    @Test void expiredTokenIsRejected() {
        JwtService expiredService = new JwtService("01234567890123456789012345678901", -1);
        UserDetails user = User.withUsername("ada").password("x").authorities("ROLE_USER").build();
        assertThrows(ExpiredJwtException.class,
                () -> expiredService.isTokenValid(expiredService.generateToken(user), user));
    }

    @Test void malformedTokenThrows() {
        assertThrows(RuntimeException.class, () -> service.extractUsername("not.a.jwt"));
    }
}
