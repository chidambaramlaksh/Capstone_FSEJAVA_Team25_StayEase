package com.example.mmt.room;

import com.example.mmt.hotel.Hotel;
import com.example.mmt.booking.Booking;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms", uniqueConstraints = @UniqueConstraint(columnNames = {"hotel_id", "room_number"}))
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerNight;

    @Column(nullable = false)
    private boolean active = true;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private int available = 1;

    @Column(nullable = false)
    private int maxOccupancy = 3;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();

    protected Room() {
    }

    public Room(Hotel hotel, String roomNumber, RoomType type, BigDecimal pricePerNight) {
        this(hotel, roomNumber, type, null, pricePerNight, 1, 3);
    }

    public Room(Hotel hotel, String roomNumber, RoomType type, String description,
                BigDecimal pricePerNight, int available, int maxOccupancy) {
        this.hotel = hotel;
        this.roomNumber = roomNumber;
        this.type = type;
        this.description = description;
        this.pricePerNight = pricePerNight;
        this.available = available;
        this.maxOccupancy = maxOccupancy;
    }

    public Long getId() { return id; }
    public Hotel getHotel() { return hotel; }
    public String getRoomNumber() { return roomNumber; }
    public RoomType getType() { return type; }
    public String getDescription() { return description; }
    public BigDecimal getPricePerNight() { return pricePerNight; }
    public int getAvailable() { return available; }
    public int getMaxOccupancy() { return maxOccupancy; }
    public List<Booking> getBookings() { return bookings; }
    public boolean isActive() { return active; }

    public void update(String roomNumber, RoomType type, BigDecimal pricePerNight, boolean active) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.pricePerNight = pricePerNight;
        this.active = active;
    }
}
