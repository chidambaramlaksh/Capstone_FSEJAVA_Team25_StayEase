package com.example.mmt.hotel;

import jakarta.persistence.*;
import com.example.mmt.room.Room;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(length = 1500)
    private String description;

    @Column(length = 1000)
    private String image;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    private List<Room> rooms = new ArrayList<>();

    protected Hotel() {
    }

    public Hotel(String name, String address, String city) {
        this(name, address, city, null, null, null, null);
    }

    public Hotel(String name, String address, String city, String description,
                 String image, BigDecimal rating, BigDecimal price) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.description = description;
        this.image = image;
        this.rating = rating;
        this.price = price;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getDescription() { return description; }
    public String getImage() { return image; }
    public BigDecimal getRating() { return rating; }
    public BigDecimal getPrice() { return price; }
    public List<Room> getRooms() { return rooms; }

    public void update(String name, String address, String city) {
        this.name = name;
        this.address = address;
        this.city = city;
    }
}
