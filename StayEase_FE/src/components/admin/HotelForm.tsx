import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AdminHotel, AdminHotelInput } from "../../types/admin";

type Props = {
  hotel: AdminHotel | null;
  onSave: (values: AdminHotelInput) => Promise<void>;
  onCancel: () => void;
};

const defaultValues: AdminHotelInput = {
  name: "",
  city: "",
  starRating: 4,
  description: "",
  coverImageUrl: "",
};

export default function HotelForm({ hotel, onSave, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AdminHotelInput>({ defaultValues });

  useEffect(() => {
    reset(hotel ? {
      name: hotel.name,
      city: hotel.city,
      starRating: hotel.starRating,
      description: hotel.description,
      coverImageUrl: hotel.coverImageUrl,
    } : defaultValues);
  }, [hotel, reset]);

  return (
    <div className="manager-modal-backdrop" role="presentation">
      <section className="manager-modal" role="dialog" aria-modal="true" aria-labelledby="hotel-form-title">
        <div className="manager-modal__heading">
          <div>
            <p className="eyebrow">HOTEL DIRECTORY</p>
            <h2 id="hotel-form-title">{hotel ? "Edit hotel" : "Add hotel"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Close">×</button>
        </div>
        <form className="manager-form" onSubmit={handleSubmit(onSave)}>
          <label>
            Hotel name
            <input autoFocus {...register("name", { required: "Hotel name is required", maxLength: { value: 120, message: "Use 120 characters or fewer" } })} />
            {errors.name && <small>{errors.name.message}</small>}
          </label>
          <label>
            City
            <input {...register("city", { required: "City is required", maxLength: { value: 80, message: "Use 80 characters or fewer" } })} />
            {errors.city && <small>{errors.city.message}</small>}
          </label>
          <label>
            Star rating
            <input type="number" min="1" max="5" step="0.1" {...register("starRating", { valueAsNumber: true, min: { value: 1, message: "Rating must be at least 1" }, max: { value: 5, message: "Rating cannot exceed 5" } })} />
            {errors.starRating && <small>{errors.starRating.message}</small>}
          </label>
          <label className="manager-form__full">
            Description
            <textarea rows={3} {...register("description", { required: "Description is required", minLength: { value: 10, message: "Use at least 10 characters" } })} />
            {errors.description && <small>{errors.description.message}</small>}
          </label>
          <label className="manager-form__full">
            Cover image URL
            <input type="url" placeholder="https://example.com/hotel.jpg" {...register("coverImageUrl", { required: "Cover image URL is required", pattern: { value: /^https?:\/\/.+/, message: "Enter a valid http(s) URL" } })} />
            {errors.coverImageUrl && <small>{errors.coverImageUrl.message}</small>}
          </label>
          <div className="manager-form__actions">
            <button className="button button--secondary" type="button" onClick={onCancel}>Cancel</button>
            <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save hotel"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
