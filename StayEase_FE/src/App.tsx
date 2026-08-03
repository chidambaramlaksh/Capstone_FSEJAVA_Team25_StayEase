import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import BookingConfirmation from "./pages/BookingConfirmation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotel/:hotelId" element={<HotelDetails />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
    </Routes>
  );
}
