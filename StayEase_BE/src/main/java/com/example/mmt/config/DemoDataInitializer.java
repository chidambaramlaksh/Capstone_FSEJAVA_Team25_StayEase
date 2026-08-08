package com.example.mmt.config;

import com.example.mmt.hotel.Hotel;
import com.example.mmt.hotel.HotelRepository;
import com.example.mmt.user.AppUser;
import com.example.mmt.user.AppUserRepository;
import com.example.mmt.user.Role;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.core.annotation.Order;

@Configuration
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
public class DemoDataInitializer {
    @Bean
    @Order(2)
    CommandLineRunner seedDemoData(HotelRepository hotels, AppUserRepository users, PasswordEncoder encoder) {
        return args -> {
            Hotel hotel = hotels.findAll().stream().findFirst()
                    .orElseGet(() -> hotels.save(new Hotel("Demo Grand Hotel", "1 Main Street", "Bengaluru")));
            if (!users.existsByEmail("admin@demo.com")) {
                users.save(new AppUser("admin@demo.com", "admin@demo.com", "Demo Admin",
                        encoder.encode("admin123"), Role.ADMIN, null));
            }
            if (!users.existsByEmail("manager@demo.com")) {
                users.save(new AppUser("manager@demo.com", "manager@demo.com", "Demo Manager",
                        encoder.encode("manager123"), Role.HOTEL_MANAGER, hotel.getId()));
            }
            if (!users.existsByEmail("user1@gmail.com")) {
                users.save(new AppUser("user1@gmail.com", "user1@gmail.com", "User One",
                        encoder.encode("123456"), Role.USER, null));
            }
        };
    }
}
