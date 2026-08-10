import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import RoomForm from "../../components/manager/RoomForm";
import { useAuth } from "../../context/AuthContext";
import { useManager } from "../../context/ManagerContext";
export default function RoomManagement() {
    const { user } = useAuth();
    const { rooms, addRoom, updateRoom, deleteRoom, toggleRoomStatus, error } = useManager();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [editing, setEditing] = useState(undefined);
    const [operationError, setOperationError] = useState("");
    const filtered = useMemo(() => rooms.filter((room) => (room.roomNumber.toLowerCase().includes(query.toLowerCase()) ||
        room.type.toLowerCase().includes(query.toLowerCase())) &&
        (status === "all" || String(room.active) === status)), [rooms, query, status]);
    const saveRoom = async (values) => {
        try {
            setOperationError("");
            if (editing) {
                await updateRoom(editing.id, values);
            }
            else if (user && typeof user.managedHotelId === 'number') {
                await addRoom(user.managedHotelId, values);
            }
            setEditing(undefined);
        }
        catch (err) {
            setOperationError(err instanceof Error ? err.message : "Operation failed");
        }
    };
    const handleDelete = async (roomId) => {
        if (window.confirm("Remove this room?")) {
            try {
                setOperationError("");
                await deleteRoom(roomId);
            }
            catch (err) {
                setOperationError(err instanceof Error ? err.message : "Failed to delete room");
            }
        }
    };
    const handleToggleStatus = async (roomId) => {
        try {
            setOperationError("");
            await toggleRoomStatus(roomId);
        }
        catch (err) {
            setOperationError(err instanceof Error ? err.message : "Failed to toggle status");
        }
    };
    return (_jsxs("section", { className: "manager-page", children: [_jsxs("div", { className: "manager-page__heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "ROOM INVENTORY" }), _jsx("h1", { children: "Room management" }), _jsx("p", { children: "Create and maintain the rooms available at your hotel." })] }), _jsx("button", { className: "button", type: "button", onClick: () => setEditing(null), children: "+ Add room" })] }), (error || operationError) && (_jsx("div", { className: "error-message", style: { marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fee", borderLeft: "4px solid #c00", color: "#c00" }, children: error || operationError })), _jsxs("div", { className: "manager-toolbar", children: [_jsx("input", { "aria-label": "Search rooms", placeholder: "Search number or type\u2026", value: query, onChange: (event) => setQuery(event.target.value) }), _jsxs("select", { "aria-label": "Filter rooms by status", value: status, onChange: (event) => setStatus(event.target.value), children: [_jsx("option", { value: "all", children: "All statuses" }), _jsx("option", { value: "true", children: "Active" }), _jsx("option", { value: "false", children: "Inactive" })] })] }), _jsx("div", { className: "room-grid", children: filtered.map((room) => (_jsxs("article", { className: "manager-room-card", children: [room.imageUrl && (_jsx("img", { src: room.imageUrl, alt: `${room.type} room ${room.roomNumber}` })), _jsxs("div", { children: [_jsxs("div", { className: "manager-room-card__top", children: [_jsx("span", { className: room.active ? "status status--active" : "status", children: room.active ? "Active" : "Inactive" }), _jsxs("span", { children: ["Room ", room.roomNumber] })] }), _jsxs("h2", { children: [room.type, " room"] }), room.description && _jsx("p", { children: room.description }), _jsxs("div", { className: "manager-room-card__details", children: [_jsxs("strong", { children: ["\u20B9", room.pricePerNight.toLocaleString("en-IN")] }), _jsxs("span", { children: ["per night \u00B7 Up to ", room.maxOccupancy, " guests"] })] }), _jsxs("div", { className: "manager-card-actions", children: [_jsx("button", { type: "button", onClick: () => setEditing(room), children: "Edit" }), _jsx("button", { className: "button--secondary", type: "button", onClick: () => handleToggleStatus(room.id), children: room.active ? "Deactivate" : "Activate" }), _jsx("button", { className: "button--danger", type: "button", onClick: () => handleDelete(room.id), children: "Delete" })] })] })] }, room.id))) }), editing !== undefined && (_jsx(RoomForm, { room: editing, onSave: saveRoom, onCancel: () => setEditing(undefined) }))] }));
}
