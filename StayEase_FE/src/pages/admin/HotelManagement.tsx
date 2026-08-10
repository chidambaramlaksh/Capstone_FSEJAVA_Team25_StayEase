import { useMemo, useState } from "react";
import HotelForm from "../../components/admin/HotelForm";
import { useAdmin } from "../../context/AdminContext";
import type { AdminHotel, AdminHotelInput } from "../../types/admin";

export default function HotelManagement() {
  const { hotels, isLoading, error, addHotel, updateHotel, deleteHotel } = useAdmin();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminHotel | null | undefined>(undefined);
  const [operationError, setOperationError] = useState("");
  const filteredHotels = useMemo(() => hotels.filter((hotel) =>
    `${hotel.name} ${hotel.city}`.toLowerCase().includes(query.toLowerCase()),
  ), [hotels, query]);

  const saveHotel = async (values: AdminHotelInput) => {
    try {
      setOperationError("");
      if (editing) {
        await updateHotel(editing.id, values);
      } else {
        await addHotel(values);
      }
      setEditing(undefined);
    } catch {
      setOperationError("Unable to save this hotel. Please review the details and try again.");
    }
  };

  const handleDelete = async (hotel: AdminHotel) => {
    if (!window.confirm(`Delete ${hotel.name}? Hotels with reservations cannot be deleted.`)) return;
    try {
      setOperationError("");
      await deleteHotel(hotel.id);
    } catch {
      setOperationError("Unable to delete this hotel. Hotels with reservations must be retained.");
    }
  };

  return (
    <section className="manager-page">
      <div className="manager-page__heading">
        <div>
          <p className="eyebrow">HOTEL DIRECTORY</p>
          <h1>Hotel management</h1>
          <p>Create listings and maintain property details across the directory.</p>
        </div>
        <button className="button" type="button" onClick={() => setEditing(null)}>+ Add hotel</button>
      </div>

      {(error || operationError) && <p className="validation" role="alert">{error || operationError}</p>}

      <div className="manager-toolbar">
        <input aria-label="Search hotels" placeholder="Search name or city…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      {isLoading ? (
        <p className="manager-empty">Loading hotel directory…</p>
      ) : (
        <div className="room-grid">
          {filteredHotels.map((hotel) => (
            <article className="manager-room-card" key={hotel.id}>
              <img src={hotel.coverImageUrl} alt={hotel.name} />
              <div>
                <div className="manager-room-card__top">
                  <span className="status status--active">★ {hotel.starRating.toFixed(1)}</span>
                  <span>{hotel.city}</span>
                </div>
                <h2>{hotel.name}</h2>
                <p>{hotel.description}</p>
                <div className="manager-room-card__details">
                  <strong>★ {hotel.starRating.toFixed(1)}</strong>
                  <span>{hotel.city}</span>
                </div>
                <div className="manager-card-actions">
                  <button type="button" onClick={() => setEditing(hotel)}>Edit</button>
                  <button className="button--danger" type="button" onClick={() => handleDelete(hotel)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
          {!filteredHotels.length && <p className="manager-empty">No hotels match this search.</p>}
        </div>
      )}

      {editing !== undefined && <HotelForm hotel={editing} onSave={saveHotel} onCancel={() => setEditing(undefined)} />}
    </section>
  );
}
