export type AdminHotel = {
  id: number;
  name: string;
  city: string;
  starRating: number;
  description: string;
  coverImageUrl: string;
};

export type AdminHotelInput = Omit<AdminHotel, "id">;
