import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
    name: "",
    city: "",
    starRating: 4,
    description: "",
    coverImageUrl: "",
};
export default function HotelForm({ hotel, onSave, onCancel }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues });
    useEffect(() => {
        reset(hotel ? {
            name: hotel.name,
            city: hotel.city,
            starRating: hotel.starRating,
            description: hotel.description,
            coverImageUrl: hotel.coverImageUrl,
        } : defaultValues);
    }, [hotel, reset]);
    return (_jsx("div", { className: "manager-modal-backdrop", role: "presentation", children: _jsxs("section", { className: "manager-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "hotel-form-title", children: [_jsxs("div", { className: "manager-modal__heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "HOTEL DIRECTORY" }), _jsx("h2", { id: "hotel-form-title", children: hotel ? "Edit hotel" : "Add hotel" })] }), _jsx("button", { className: "icon-button", type: "button", onClick: onCancel, "aria-label": "Close", children: "\u00D7" })] }), _jsxs("form", { className: "manager-form", onSubmit: handleSubmit(onSave), children: [_jsxs("label", { children: ["Hotel name", _jsx("input", { autoFocus: true, ...register("name", { required: "Hotel name is required", maxLength: { value: 120, message: "Use 120 characters or fewer" } }) }), errors.name && _jsx("small", { children: errors.name.message })] }), _jsxs("label", { children: ["City", _jsx("input", { ...register("city", { required: "City is required", maxLength: { value: 80, message: "Use 80 characters or fewer" } }) }), errors.city && _jsx("small", { children: errors.city.message })] }), _jsxs("label", { children: ["Star rating", _jsx("input", { type: "number", min: "1", max: "5", step: "0.1", ...register("starRating", { valueAsNumber: true, min: { value: 1, message: "Rating must be at least 1" }, max: { value: 5, message: "Rating cannot exceed 5" } }) }), errors.starRating && _jsx("small", { children: errors.starRating.message })] }), _jsxs("label", { className: "manager-form__full", children: ["Description", _jsx("textarea", { rows: 3, ...register("description", { required: "Description is required", minLength: { value: 10, message: "Use at least 10 characters" } }) }), errors.description && _jsx("small", { children: errors.description.message })] }), _jsxs("label", { className: "manager-form__full", children: ["Cover image URL", _jsx("input", { type: "url", placeholder: "https://example.com/hotel.jpg", ...register("coverImageUrl", { required: "Cover image URL is required", pattern: { value: /^https?:\/\/.+/, message: "Enter a valid http(s) URL" } }) }), errors.coverImageUrl && _jsx("small", { children: errors.coverImageUrl.message })] }), _jsxs("div", { className: "manager-form__actions", children: [_jsx("button", { className: "button button--secondary", type: "button", onClick: onCancel, children: "Cancel" }), _jsx("button", { className: "button", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Saving..." : "Save hotel" })] })] })] }) }));
}
