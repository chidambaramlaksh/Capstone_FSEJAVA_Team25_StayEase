# Hotel Booking API

Spring Boot REST backend for a React hotel-booking frontend. It uses Spring MVC controllers, service classes, Spring Data JPA, H2, and stateless JWT bearer authentication.

## Run

```bash
mvn spring-boot:run
```

The API runs on `http://localhost:8080`. H2 is in-memory, so data is reset when the application stops. The H2 console is available at `/h2-console` with JDBC URL `jdbc:h2:mem:hotel_booking`, username `sa`, and an empty password.

For local role testing, start with demo data:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--app.seed-demo-data=true"
```

Demo accounts are `admin@demo.com/admin123`, `manager@demo.com/manager123`, and `user1@gmail.com/123456`. Do not enable this in a deployed environment.

## Authentication

`POST /api/auth/register` creates a normal `USER`; `POST /api/auth/login` returns a JWT plus the authenticated user's ID, email, and name.

Login request:

```json
{ "email": "user@example.com", "password": "password123" }
```

Login response:

```json
{ "userId": 1, "token": "<jwt>", "email": "user@example.com", "name": "Example User" }
```

Example cURL:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

Send the token from React as:

```http
Authorization: Bearer <token>
```

JWT was selected over a session cookie because the frontend and API can remain independently deployable and the API stays stateless, which is convenient for scaling. The trade-offs are token revocation is not immediate and the frontend must protect token storage. A session cookie would simplify revocation and browser storage, but needs server-side session state (or a shared session store) and CSRF protection. In production, use HTTPS, replace `app.jwt.secret`, and prefer a short-lived access token with a refresh-token strategy.

## Roles and endpoints

Unauthenticated guests can browse the hotel directory, list rooms, and query availability:

- `GET /api/hotels`
- `GET /api/hotels?city=Mumbai`
- `GET /api/hotels/{hotelId}`
- `GET /api/hotels/{hotelId}/rooms`
- `GET /api/hotels/{hotelId}/availability?checkIn=2026-08-10&checkOut=2026-08-12`

When started with `--app.seed-demo-data=true`, the H2 database is populated with the six Mumbai and Pune hotels from the sample catalog, including their room categories, descriptions, prices, ratings, images, and availability counts.

Normal users can register, book, view their bookings, and cancel their own bookings:

- `POST /api/bookings` with `{ "roomId": 1, "checkInDate": "2026-08-10", "checkOutDate": "2026-08-12" }`
- `GET /api/bookings/me`
- `PUT /api/bookings/{bookingId}/cancel`

Hotel managers can manage rooms only for the hotel assigned to their user record and can view its upcoming bookings:

- `POST /api/hotels/{hotelId}/rooms`
- `PUT /api/rooms/{roomId}`
- `DELETE /api/rooms/{roomId}`
- `GET /api/manager/bookings/upcoming`

Admins can manage the hotel directory:

- `POST /api/hotels`
- `PUT /api/hotels/{hotelId}`
- `DELETE /api/hotels/{hotelId}`

Role checks are present on controllers through `@PreAuthorize`. Manager ownership is additionally checked in the service so a manager cannot mutate another hotel by changing a path parameter.
