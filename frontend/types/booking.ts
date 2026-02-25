export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
}

export interface BookingMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
