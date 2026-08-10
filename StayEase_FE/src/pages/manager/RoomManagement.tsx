import { useMemo, useState } from "react";
import RoomForm from "../../components/manager/RoomForm";
import { useAuth } from "../../context/AuthContext";
import { useManager } from "../../context/ManagerContext";
import type { Room, RoomInput } from "../../types/manager";

export default function RoomManagement() {
  const { user } = useAuth();
  const { rooms, addRoom, updateRoom, deleteRoom, toggleRoomStatus, error } = useManager();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Room | null | undefined>(undefined);
  const [operationError, setOperationError] = useState("");
  
  const filtered = useMemo(
    () =>
      rooms.filter(
        (room) =>
          (room.roomNumber.toLowerCase().includes(query.toLowerCase()) ||
            room.type.toLowerCase().includes(query.toLowerCase())) &&
          (status === "all" || String(room.active) === status),
      ),
    [rooms, query, status],
  );
  
  const saveRoom = async (values: RoomInput) => {
    try {
      setOperationError("");
      if (editing) {
        await updateRoom(editing.id, values);
      } else if (user && typeof user.managedHotelId === 'number') {
        await addRoom(user.managedHotelId, values);
      }
      setEditing(undefined);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (roomId: number) => {
    if (window.confirm("Remove this room?")) {
      try {
        setOperationError("");
        await deleteRoom(roomId);
      } catch (err) {
        setOperationError(err instanceof Error ? err.message : "Failed to delete room");
      }
    }
  };

  const handleToggleStatus = async (roomId: number) => {
    try {
      setOperationError("");
      await toggleRoomStatus(roomId);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  return (
    <section className="manager-page">
      <div className="manager-page__heading">
        <div>
          <p className="eyebrow">ROOM INVENTORY</p>
          <h1>Room management</h1>
          <p>Create and maintain the rooms available at your hotel.</p>
        </div>
        <button
          className="button"
          type="button"
          onClick={() => setEditing(null)}
        >
          + Add room
        </button>
      </div>
      
      {(error || operationError) && (
        <div className="error-message" style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fee", borderLeft: "4px solid #c00", color: "#c00" }}>
          {error || operationError}
        </div>
      )}
      
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
            {room.imageUrl && (
              <img
                src={room.imageUrl}
                alt={`${room.type} room ${room.roomNumber}`}
              />
            )}
            <div>
              <div className="manager-room-card__top">
                <span
                  className={room.active ? "status status--active" : "status"}
                >
                  {room.active ? "Active" : "Inactive"}
                </span>
                <span>Room {room.roomNumber}</span>
              </div>
              <h2>{room.type} room</h2>
              {room.description && <p>{room.description}</p>}
              <div className="manager-room-card__details">
                <strong>₹{room.pricePerNight.toLocaleString("en-IN")}</strong>
                <span>per night · Up to {room.maxOccupancy} guests</span>
              </div>
              <div className="manager-card-actions">
                <button type="button" onClick={() => setEditing(room)}>
                  Edit
                </button>
                <button
                  className="button--secondary"
                  type="button"
                  onClick={() => handleToggleStatus(room.id)}
                >
                  {room.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="button--danger"
                  type="button"
                  onClick={() => handleDelete(room.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {editing !== undefined && (
        <RoomForm room={editing} onSave={saveRoom} onCancel={() => setEditing(undefined)} />
      )}
    </section>
  );
}
