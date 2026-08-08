package com.example.mmt.auth;

import com.example.mmt.common.BadRequestException;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.AppUserRepository;
import com.example.mmt.user.Role;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (users.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }
        AppUser user = users.save(new AppUser(
                request.email(), request.email(), request.name(), passwordEncoder.encode(request.password()),
                Role.USER, null));
        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmail(request.email())
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPassword()))
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(AppUser user) {
        return new AuthResponse(user.getId(), jwtService.generateToken(user), user.getEmail(), user.getName());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return users.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
