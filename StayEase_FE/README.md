# StayEase Basic

## Run

```bash
npm install
npm run dev
```

Basic Vite + React + TypeScript project structure.

## Login API

Set `VITE_LOGIN_API_URL` in a local `.env` file to the login endpoint. It
defaults to `/api/auth/login` and receives `{ "email": "...", "password": "..." }`.
The successful response must include `userId`, `token`, `email`, and `name`.
Optional `role`, `userType`, and other response fields are retained unchanged
in `AuthContext` and are available through `useAuth()` on every page.

Hotels are loaded from `GET /api/hotels?city={city}`. Set
`VITE_HOTELS_API_URL` to override the default `/api/hotels` route.
The complete response, including rooms, is retained in `HotelContext` for the
hotel details page and persisted for the current browser session.

Bookings are loaded from `GET /api/bookings/me` with the logged-in user's JWT
sent as a Bearer token.

Room reservations are created with `POST /api/bookings`, sending the selected
`roomId`, `checkInDate`, and `checkOutDate` with the same Bearer token.
