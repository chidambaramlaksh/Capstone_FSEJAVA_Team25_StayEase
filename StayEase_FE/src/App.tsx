import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotel/:hotelId" element={<HotelDetails />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/home" element={<AdminHome />} />
    </Routes>
  );
}
