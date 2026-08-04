import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Room, RoomInput } from "../../types/manager";

type Props = {
  room: Room | null;
  onSave: (values: RoomInput) => void;
  onCancel: () => void;
};
const defaultValues: RoomInput = {
  roomNumber: "",
  roomType: "Single",
  pricePerNight: 0,
  maxOccupancy: 1,
  description: "",
  imageUrl: "",
  isActive: true,
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
            roomType: room.roomType,
            pricePerNight: room.pricePerNight,
            maxOccupancy: room.maxOccupancy,
            description: room.description,
            imageUrl: room.imageUrl,
            isActive: room.isActive,
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
            <select {...register("roomType")}>
              <option>Single</option>
              <option>Double</option>
              <option>Suite</option>
              <option>Deluxe</option>
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
              {...register("description", {
                required: "Description is required",
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
                required: "Image URL is required",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Enter a valid http(s) URL",
                },
              })}
            />
            {errors.imageUrl && <small>{errors.imageUrl.message}</small>}
          </label>
          <label className="manager-toggle">
            <input type="checkbox" {...register("isActive")} />
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
            <button className="button" disabled={isSubmitting} type="submit">
              {room ? "Save changes" : "Add room"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
