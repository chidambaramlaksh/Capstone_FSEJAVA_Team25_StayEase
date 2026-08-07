package com.example.mmt.config;

import com.example.mmt.hotel.Hotel;
import com.example.mmt.hotel.HotelRepository;
import com.example.mmt.room.Room;
import com.example.mmt.room.RoomRepository;
import com.example.mmt.room.RoomType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.math.BigDecimal;

@Configuration
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
public class HotelCatalogInitializer {
    @Bean
    @Order(1)
    CommandLineRunner seedHotelCatalog(HotelRepository hotels, RoomRepository rooms) {
        return args -> {
            if (hotels.count() > 0) {
                return;
            }

            seed(hotels, rooms, "The Marine House",
                    "A quiet coastal retreat with airy rooms and views of the Arabian Sea.", "Mumbai",
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
                    4.8, 8500,
                    new RoomData("A serene room for one, with a queen bed and work desk.", 8500, 4),
                    new RoomData("A spacious room with a king bed, ideal for two guests.", 11200, 6),
                    new RoomData("A sea-view suite with a separate lounge and premium amenities.", 16900, 2));

            seed(hotels, rooms, "Kala Ghoda Courtyard",
                    "A heritage-inspired stay in the heart of Mumbai’s arts district.", "Mumbai",
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=85",
                    4.6, 7200,
                    new RoomData("A peaceful heritage room for solo city explorers.", 7200, 0),
                    new RoomData("A characterful room for two with courtyard views.", 9800, 4),
                    new RoomData("An elegant suite with a private sitting area.", 14300, 2));

            seed(hotels, rooms, "Bandra Bay Suites",
                    "Contemporary suites close to the promenade, cafés and city nightlife.", "Mumbai",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=85",
                    4.7, 9100,
                    new RoomData("A bright, modern room with all the essentials.", 9100, 3),
                    new RoomData("A generous king room designed for relaxing together.", 12400, 7),
                    new RoomData("A refined suite with a lounge and bay-facing windows.", 18400, 3));

            seed(hotels, rooms, "The Deccan Pavilion",
                    "A graceful garden stay that pairs Pune warmth with modern comfort.", "Pune",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=85",
                    4.7, 6200,
                    new RoomData("A restful garden-facing room for one guest.", 6200, 6),
                    new RoomData("A calming double room with an inviting king bed.", 8500, 8),
                    new RoomData("A spacious suite with a garden terrace and lounge.", 12800, 2));

            seed(hotels, rooms, "Koregaon Park House",
                    "Leafy surroundings, thoughtful interiors and exceptional local dining.", "Pune",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85",
                    4.5, 5800,
                    new RoomData("A stylish room for a quiet solo escape.", 5800, 5),
                    new RoomData("A comfortable room for two in leafy Koregaon Park.", 7900, 6),
                    new RoomData("A generous suite with a reading nook and dining space.", 11900, 2));

            seed(hotels, rooms, "Sahakar Residency",
                    "A polished, restful base for discovering Pune’s old city and culture.", "Pune",
                    "https://images.unsplash.com/photo-1606402179428-a579de2f76e3?auto=format&fit=crop&w=1000&q=85",
                    4.6, 5400,
                    new RoomData("A practical and polished room for one traveller.", 5400, 7),
                    new RoomData("A warm, comfortable double room with city views.", 7400, 5),
                    new RoomData("A relaxed suite with extra living space for longer stays.", 10600, 3));
        };
    }

    private void seed(HotelRepository hotels, RoomRepository rooms, String name, String description,
                      String city, String image, double rating, int price, RoomData single,
                      RoomData doubleRoom, RoomData suite) {
        Hotel hotel = hotels.save(new Hotel(name, name, city, description, image,
                BigDecimal.valueOf(rating), BigDecimal.valueOf(price)));
        rooms.save(new Room(hotel, "Single", RoomType.SINGLE, single.description(),
                BigDecimal.valueOf(single.price()), single.available(), 3));
        rooms.save(new Room(hotel, "Double", RoomType.DOUBLE, doubleRoom.description(),
                BigDecimal.valueOf(doubleRoom.price()), doubleRoom.available(), 3));
        rooms.save(new Room(hotel, "Suite", RoomType.SUITE, suite.description(),
                BigDecimal.valueOf(suite.price()), suite.available(), 3));
    }

    private record RoomData(String description, int price, int available) {
    }
}
