package com.example.mmt.auth;

import com.example.mmt.TestFixtures;
import com.example.mmt.common.BadRequestException;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.AppUserRepository;
import com.example.mmt.user.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private AppUserRepository users;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private AuthService service;

    @BeforeEach
    void setUp() {
        // A real deterministic JWT service avoids mocking a concrete crypto class.
        service = new AuthService(users, passwordEncoder,
                new JwtService("01234567890123456789012345678901", 60_000));
    }

    @Test void registerSavesEncodedUserAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("Ada", "ada@example.com", "password1");
        AppUser saved = TestFixtures.withId(new AppUser("ada@example.com", "ada@example.com", "Ada", "hash", Role.USER, null), 7L);
        when(users.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("hash");
        when(users.save(any(AppUser.class))).thenReturn(saved);

        AuthResponse result = service.register(request);

        assertAll(() -> assertEquals(7L, result.userId()), () -> assertFalse(result.token().isBlank()),
                () -> assertEquals("ada@example.com", result.email()), () -> assertEquals("USER", result.role()));
        ArgumentCaptor<AppUser> captor = ArgumentCaptor.forClass(AppUser.class);
        verify(users).save(captor.capture());
        assertEquals("hash", captor.getValue().getPassword());
        verify(passwordEncoder).encode("password1");
    }

    @Test void registerRejectsDuplicateEmailWithoutEncoding() {
        RegisterRequest request = new RegisterRequest("Ada", "ada@example.com", "password1");
        when(users.existsByEmail(request.email())).thenReturn(true);
        assertThrows(BadRequestException.class, () -> service.register(request));
        verify(users, never()).save(any());
        verifyNoInteractions(passwordEncoder);
    }

    @Test void registerPropagatesRepositoryFailure() {
        RegisterRequest request = new RegisterRequest("Ada", "ada@example.com", "password1");
        when(users.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hash");
        when(users.save(any())).thenThrow(new IllegalStateException("database unavailable"));
        assertThrows(IllegalStateException.class, () -> service.register(request));
    }

    @Test void loginReturnsResponseWhenPasswordMatches() {
        AppUser user = TestFixtures.withId(new AppUser("ada@example.com", "ada@example.com", "Ada", "hash", Role.USER, null), 3L);
        when(users.findByEmail("ada@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password1", "hash")).thenReturn(true);
        AuthResponse result = service.login(new LoginRequest("ada@example.com", "password1"));
        assertFalse(result.token().isBlank());
        verify(passwordEncoder).matches("password1", "hash");
    }

    @Test void loginRejectsMissingUserOrIncorrectPassword() {
        when(users.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertThrows(BadRequestException.class, () -> service.login(new LoginRequest("missing@example.com", "x")));
        AppUser user = new AppUser("ada", "ada@example.com", "Ada", "hash", Role.USER, null);
        when(users.findByEmail("ada@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hash")).thenReturn(false);
        assertThrows(BadRequestException.class, () -> service.login(new LoginRequest("ada@example.com", "wrong")));
    }

    @Test void nullRequestsFailFast() {
        assertThrows(NullPointerException.class, () -> service.register(null));
        assertThrows(NullPointerException.class, () -> service.login(null));
    }

    @Test void loadUserByUsernameReturnsUserOrThrows() {
        AppUser user = new AppUser("ada", "ada@example.com", "Ada", "hash", Role.USER, null);
        when(users.findByUsername("ada")).thenReturn(Optional.of(user));
        assertSame(user, service.loadUserByUsername("ada"));
        when(users.findByUsername("missing")).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class, () -> service.loadUserByUsername("missing"));
    }
}
