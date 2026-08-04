import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
const defaultValues = {
  roomNumber: "",
  roomType: "Single",
  pricePerNight: 0,
  maxOccupancy: 1,
  description: "",
  imageUrl: "",
  isActive: true,
};
export default function RoomForm({ room, onSave, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });
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
  return _jsx("div", {
    className: "manager-modal-backdrop",
    role: "presentation",
    children: _jsxs("section", {
      className: "manager-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "room-form-title",
      children: [
        _jsxs("div", {
          className: "manager-modal__heading",
          children: [
            _jsxs("div", {
              children: [
                _jsx("p", { className: "eyebrow", children: "ROOM INVENTORY" }),
                _jsx("h2", {
                  id: "room-form-title",
                  children: room ? "Edit room" : "Add room",
                }),
              ],
            }),
            _jsx("button", {
              className: "icon-button",
              type: "button",
              onClick: onCancel,
              "aria-label": "Close",
              children: "\u00D7",
            }),
          ],
        }),
        _jsxs("form", {
          className: "manager-form",
          onSubmit: handleSubmit(onSave),
          children: [
            _jsxs("label", {
              children: [
                "Room number",
                _jsx("input", {
                  autoFocus: true,
                  ...register("roomNumber", {
                    required: "Room number is required",
                    maxLength: {
                      value: 10,
                      message: "Use 10 characters or fewer",
                    },
                  }),
                }),
                errors.roomNumber &&
                  _jsx("small", { children: errors.roomNumber.message }),
              ],
            }),
            _jsxs("label", {
              children: [
                "Room type",
                _jsxs("select", {
                  ...register("roomType"),
                  children: [
                    _jsx("option", { children: "Single" }),
                    _jsx("option", { children: "Double" }),
                    _jsx("option", { children: "Suite" }),
                    _jsx("option", { children: "Deluxe" }),
                  ],
                }),
              ],
            }),
            _jsxs("label", {
              children: [
                "Price per night (\u20B9)",
                _jsx("input", {
                  type: "number",
                  min: "1",
                  ...register("pricePerNight", {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Price must be greater than zero",
                    },
                  }),
                }),
                errors.pricePerNight &&
                  _jsx("small", { children: errors.pricePerNight.message }),
              ],
            }),
            _jsxs("label", {
              children: [
                "Maximum occupancy",
                _jsx("input", {
                  type: "number",
                  min: "1",
                  max: "10",
                  ...register("maxOccupancy", {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "At least one guest is required",
                    },
                    max: { value: 10, message: "Maximum is 10 guests" },
                  }),
                }),
                errors.maxOccupancy &&
                  _jsx("small", { children: errors.maxOccupancy.message }),
              ],
            }),
            _jsxs("label", {
              className: "manager-form__full",
              children: [
                "Description",
                _jsx("textarea", {
                  rows: 3,
                  ...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Use at least 10 characters",
                    },
                  }),
                }),
                errors.description &&
                  _jsx("small", { children: errors.description.message }),
              ],
            }),
            _jsxs("label", {
              className: "manager-form__full",
              children: [
                "Image URL",
                _jsx("input", {
                  type: "url",
                  placeholder: "https://example.com/room.jpg",
                  ...register("imageUrl", {
                    required: "Image URL is required",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Enter a valid http(s) URL",
                    },
                  }),
                }),
                errors.imageUrl &&
                  _jsx("small", { children: errors.imageUrl.message }),
              ],
            }),
            _jsxs("label", {
              className: "manager-toggle",
              children: [
                _jsx("input", { type: "checkbox", ...register("isActive") }),
                _jsx("span", {
                  children: "Room is active and available for booking",
                }),
              ],
            }),
            _jsxs("div", {
              className: "manager-form__actions",
              children: [
                _jsx("button", {
                  className: "button button--secondary",
                  type: "button",
                  onClick: onCancel,
                  children: "Cancel",
                }),
                _jsx("button", {
                  className: "button",
                  disabled: isSubmitting,
                  type: "submit",
                  children: room ? "Save changes" : "Add room",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
