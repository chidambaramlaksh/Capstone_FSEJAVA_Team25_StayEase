import { useMemo, useState } from "react";
import RoomForm from "../../components/manager/RoomForm";
import { useAuth } from "../../context/AuthContext";
import { useManager } from "../../context/ManagerContext";
import type { Room, RoomInput } from "../../types/manager";

export default function RoomManagement() {
  const { user } = useAuth();
  const { rooms, addRoom, updateRoom, deleteRoom } = useManager();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Room | null | undefined>(undefined);
  const filtered = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.hotelId === user?.hotelId &&
          (room.roomNumber.toLowerCase().includes(query.toLowerCase()) ||
            room.roomType.toLowerCase().includes(query.toLowerCase())) &&
          (status === "all" || String(room.isActive) === status),
      ),
    [rooms, user?.hotelId, query, status],
  );
  const saveRoom = (values: RoomInput) => {
    if (editing) updateRoom(editing.id, values);
    else if (user) addRoom(user.hotelId, values);
    setEditing(undefined);
  };
  return (
    <section className="manager-page">
      <div className="manager-page__heading">
        <div>
          <p className="eyebrow">ROOM INVENTORY</p>
          <h1>Room management</h1>
          <p>Create and maintain the rooms available at The Marine House.</p>
        </div>
        <button
          className="button"
          type="button"
          onClick={() => setEditing(null)}
        >
          + Add room
        </button>
      </div>
      <div className="manager-toolbar">
        <input
          aria-label="Search rooms"
          placeholder="Search number or type…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Filter rooms by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <div className="room-grid">
        {filtered.map((room) => (
          <article className="manager-room-card" key={room.id}>
            <img
              src={room.imageUrl}
              alt={`${room.roomType} room ${room.roomNumber}`}
            />
            <div>
              <div className="manager-room-card__top">
                <span
                  className={room.isActive ? "status status--active" : "status"}
                >
                  {room.isActive ? "Active" : "Inactive"}
                </span>
                <span>Room {room.roomNumber}</span>
              </div>
              <h2>{room.roomType} room</h2>
              <p>{room.description}</p>
              <div className="manager-room-card__details">
                <strong>₹{room.pricePerNight.toLocaleString("en-IN")}</strong>
                <span>per night · Up to {room.maxOccupancy} guests</span>
              </div>
              <div className="manager-card-actions">
                <button type="button" onClick={() => setEditing(room)}>
                  Edit
                </button>
                <button
                  className="button--danger"
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove room ${room.roomNumber}?`))
                      deleteRoom(room.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <p className="manager-empty">No rooms match these filters.</p>
      )}
      {editing !== undefined && (
        <RoomForm
          room={editing}
          onSave={saveRoom}
          onCancel={() => setEditing(undefined)}
        />
      )}
    </section>
  );
}
