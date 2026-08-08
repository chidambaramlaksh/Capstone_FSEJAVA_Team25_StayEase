import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Room, RoomInput } from "../../types/manager";

type Props = {
  room: Room | null;
  onSave: (values: RoomInput) => Promise<void>;
  onCancel: () => void;
};
const defaultValues: RoomInput = {
  roomNumber: "",
  type: "SINGLE",
  pricePerNight: 0,
  maxOccupancy: 1,
  description: "",
  imageUrl: "",
  active: true,
};

export default function RoomForm({ room, onSave, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomInput>({ defaultValues });
  useEffect(() => {
    reset(
      room
        ? {
            roomNumber: room.roomNumber,
            type: room.type,
            pricePerNight: room.pricePerNight,
            maxOccupancy: room.maxOccupancy,
            description: room.description || "",
            imageUrl: room.imageUrl || "",
            active: room.active,
          }
        : defaultValues,
    );
  }, [room, reset]);
  return (
    <div className="manager-modal-backdrop" role="presentation">
      <section
        className="manager-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-form-title"
      >
        <div className="manager-modal__heading">
          <div>
            <p className="eyebrow">ROOM INVENTORY</p>
            <h2 id="room-form-title">{room ? "Edit room" : "Add room"}</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form className="manager-form" onSubmit={handleSubmit(onSave)}>
          <label>
            Room number
            <input
              autoFocus
              {...register("roomNumber", {
                required: "Room number is required",
                maxLength: { value: 10, message: "Use 10 characters or fewer" },
              })}
            />
            {errors.roomNumber && <small>{errors.roomNumber.message}</small>}
          </label>
          <label>
            Room type
            <select {...register("type")}>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="SUITE">Suite</option>
              <option value="DELUXE">Deluxe</option>
            </select>
          </label>
          <label>
            Price per night (₹)
            <input
              type="number"
              min="1"
              {...register("pricePerNight", {
                valueAsNumber: true,
                min: { value: 1, message: "Price must be greater than zero" },
              })}
            />
            {errors.pricePerNight && (
              <small>{errors.pricePerNight.message}</small>
            )}
          </label>
          <label>
            Maximum occupancy
            <input
              type="number"
              min="1"
              max="10"
              {...register("maxOccupancy", {
                valueAsNumber: true,
                min: { value: 1, message: "At least one guest is required" },
                max: { value: 10, message: "Maximum is 10 guests" },
              })}
            />
            {errors.maxOccupancy && (
              <small>{errors.maxOccupancy.message}</small>
            )}
          </label>
          <label className="manager-form__full">
            Description
            <textarea
              rows={3}
              placeholder="Describe the room..."
              {...register("description", {
                minLength: { value: 10, message: "Use at least 10 characters" },
              })}
            />
            {errors.description && <small>{errors.description.message}</small>}
          </label>
          <label className="manager-form__full">
            Image URL
            <input
              type="url"
              placeholder="https://example.com/room.jpg"
              {...register("imageUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Enter a valid http(s) URL",
                },
              })}
            />
            {errors.imageUrl && <small>{errors.imageUrl.message}</small>}
          </label>
          <label className="manager-toggle">
            <input type="checkbox" {...register("active")} />
            <span>Room is active and available for booking</span>
          </label>
          <div className="manager-form__actions">
            <button
              className="button button--secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save room"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
