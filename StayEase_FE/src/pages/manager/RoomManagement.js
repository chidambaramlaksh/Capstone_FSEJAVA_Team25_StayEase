import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import RoomForm from "../../components/manager/RoomForm";
import { useAuth } from "../../context/AuthContext";
import { useManager } from "../../context/ManagerContext";
export default function RoomManagement() {
    const { user } = useAuth();
    const { rooms, addRoom, updateRoom, deleteRoom } = useManager();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [editing, setEditing] = useState(undefined);
    const filtered = useMemo(() => rooms.filter((room) => room.hotelId === user?.hotelId &&
        (room.roomNumber.toLowerCase().includes(query.toLowerCase()) ||
            room.roomType.toLowerCase().includes(query.toLowerCase())) &&
        (status === "all" || String(room.isActive) === status)), [rooms, user?.hotelId, query, status]);
    const saveRoom = (values) => {
        if (editing)
            updateRoom(editing.id, values);
        else if (user?.hotelId !== undefined)
            addRoom(user.hotelId, values);
        setEditing(undefined);
    };
    return (_jsxs("section", { className: "manager-page", children: [_jsxs("div", { className: "manager-page__heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "ROOM INVENTORY" }), _jsx("h1", { children: "Room management" }), _jsx("p", { children: "Create and maintain the rooms available at The Marine House." })] }), _jsx("button", { className: "button", type: "button", onClick: () => setEditing(null), children: "+ Add room" })] }), _jsxs("div", { className: "manager-toolbar", children: [_jsx("input", { "aria-label": "Search rooms", placeholder: "Search number or type\u2026", value: query, onChange: (event) => setQuery(event.target.value) }), _jsxs("select", { "aria-label": "Filter rooms by status", value: status, onChange: (event) => setStatus(event.target.value), children: [_jsx("option", { value: "all", children: "All statuses" }), _jsx("option", { value: "true", children: "Active" }), _jsx("option", { value: "false", children: "Inactive" })] })] }), _jsx("div", { className: "room-grid", children: filtered.map((room) => (_jsxs("article", { className: "manager-room-card", children: [_jsx("img", { src: room.imageUrl, alt: `${room.roomType} room ${room.roomNumber}` }), _jsxs("div", { children: [_jsxs("div", { className: "manager-room-card__top", children: [_jsx("span", { className: room.isActive ? "status status--active" : "status", children: room.isActive ? "Active" : "Inactive" }), _jsxs("span", { children: ["Room ", room.roomNumber] })] }), _jsxs("h2", { children: [room.roomType, " room"] }), _jsx("p", { children: room.description }), _jsxs("div", { className: "manager-room-card__details", children: [_jsxs("strong", { children: ["\u20B9", room.pricePerNight.toLocaleString("en-IN")] }), _jsxs("span", { children: ["per night \u00B7 Up to ", room.maxOccupancy, " guests"] })] }), _jsxs("div", { className: "manager-card-actions", children: [_jsx("button", { type: "button", onClick: () => setEditing(room), children: "Edit" }), _jsx("button", { className: "button--danger", type: "button", onClick: () => {
                                                if (window.confirm(`Remove room ${room.roomNumber}?`))
                                                    deleteRoom(room.id);
                                            }, children: "Delete" })] })] })] }, room.id))) }), !filtered.length && (_jsx("p", { className: "manager-empty", children: "No rooms match these filters." })), editing !== undefined && (_jsx(RoomForm, { room: editing, onSave: saveRoom, onCancel: () => setEditing(undefined) }))] }));
}
