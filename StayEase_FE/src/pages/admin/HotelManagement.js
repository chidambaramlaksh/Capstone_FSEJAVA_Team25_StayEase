import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import HotelForm from "../../components/admin/HotelForm";
import { useAdmin } from "../../context/AdminContext";
export default function HotelManagement() {
    const { hotels, isLoading, error, addHotel, updateHotel, deleteHotel } = useAdmin();
    const [query, setQuery] = useState("");
    const [editing, setEditing] = useState(undefined);
    const [operationError, setOperationError] = useState("");
    const filteredHotels = useMemo(() => hotels.filter((hotel) => `${hotel.name} ${hotel.city}`.toLowerCase().includes(query.toLowerCase())), [hotels, query]);
    const saveHotel = async (values) => {
        try {
            setOperationError("");
            if (editing) {
                await updateHotel(editing.id, values);
            }
            else {
                await addHotel(values);
            }
            setEditing(undefined);
        }
        catch {
            setOperationError("Unable to save this hotel. Please review the details and try again.");
        }
    };
    const handleDelete = async (hotel) => {
        if (!window.confirm(`Delete ${hotel.name}? Hotels with reservations cannot be deleted.`))
            return;
        try {
            setOperationError("");
            await deleteHotel(hotel.id);
        }
        catch {
            setOperationError("Unable to delete this hotel. Hotels with reservations must be retained.");
        }
    };
    return (_jsxs("section", { className: "manager-page", children: [_jsxs("div", { className: "manager-page__heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "HOTEL DIRECTORY" }), _jsx("h1", { children: "Hotel management" }), _jsx("p", { children: "Create listings and maintain property details across the directory." })] }), _jsx("button", { className: "button", type: "button", onClick: () => setEditing(null), children: "+ Add hotel" })] }), (error || operationError) && _jsx("p", { className: "validation", role: "alert", children: error || operationError }), _jsx("div", { className: "manager-toolbar", children: _jsx("input", { "aria-label": "Search hotels", placeholder: "Search name or city\u2026", value: query, onChange: (event) => setQuery(event.target.value) }) }), isLoading ? (_jsx("p", { className: "manager-empty", children: "Loading hotel directory\u2026" })) : (_jsxs("div", { className: "room-grid", children: [filteredHotels.map((hotel) => (_jsxs("article", { className: "manager-room-card", children: [_jsx("img", { src: hotel.coverImageUrl, alt: hotel.name }), _jsxs("div", { children: [_jsxs("div", { className: "manager-room-card__top", children: [_jsxs("span", { className: "status status--active", children: ["\u2605 ", hotel.starRating.toFixed(1)] }), _jsx("span", { children: hotel.city })] }), _jsx("h2", { children: hotel.name }), _jsx("p", { children: hotel.description }), _jsxs("div", { className: "manager-room-card__details", children: [_jsxs("strong", { children: ["\u2605 ", hotel.starRating.toFixed(1)] }), _jsx("span", { children: hotel.city })] }), _jsxs("div", { className: "manager-card-actions", children: [_jsx("button", { type: "button", onClick: () => setEditing(hotel), children: "Edit" }), _jsx("button", { className: "button--danger", type: "button", onClick: () => handleDelete(hotel), children: "Delete" })] })] })] }, hotel.id))), !filteredHotels.length && _jsx("p", { className: "manager-empty", children: "No hotels match this search." })] })), editing !== undefined && _jsx(HotelForm, { hotel: editing, onSave: saveHotel, onCancel: () => setEditing(undefined) })] }));
}
