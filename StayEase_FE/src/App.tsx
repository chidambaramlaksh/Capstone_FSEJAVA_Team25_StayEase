import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import RoomManagement from "./pages/manager/RoomManagement";
import UpcomingBookings from "./pages/manager/UpcomingBookings";
import ProtectedRoute from "./components/manager/ProtectedRoute";
import ManagerLayout from "./components/manager/ManagerLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotel/:hotelId" element={<HotelDetails />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/home" element={<AdminHome />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["HOTEL_MANAGER"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<UpcomingBookings />} />
        </Route>
      </Route>
    </Routes>
  );
}
