export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes: string | null;
  serviceId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    businessId: string;
    business: {
      id: string;
      name: string;
      address: string | null;
      phone: string | null;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface CreateBookingPayload {
  serviceId: string;
  startTime: string;
  notes?: string;
}

export interface UpdateBookingPayload {
  startTime?: string;
  notes?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}
