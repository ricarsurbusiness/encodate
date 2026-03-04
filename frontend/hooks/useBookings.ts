import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/axios";
import type {
  Booking,
  BookingFilters,
  BookingStatus,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "@/types/booking";
import type { PaginatedResponse } from "@/types/common";
import { bookingKeys } from "./query-keys";

export function useMyBookings(filters?: BookingFilters) {
  return useQuery<PaginatedResponse<Booking>>({
    queryKey: bookingKeys.list((filters ?? {}) as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Booking>>(
        "/bookings/my-bookings",
        { params: filters },
      );
      return data;
    },
  });
}

export function useBooking(id: string) {
  return useQuery<Booking>({
    queryKey: bookingKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Booking>(`/bookings/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, AxiosError, CreateBookingPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<Booking>("/bookings", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Booking, AxiosError, UpdateBookingPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.patch<Booking>(`/bookings/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, AxiosError, string>({
    mutationFn: async (bookingId) => {
      const { data } = await api.patch<Booking>(
        `/bookings/${bookingId}/cancel`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useBusinessBookings(
  businessId: string,
  filters?: BookingFilters,
) {
  return useQuery<PaginatedResponse<Booking>>({
    queryKey: bookingKeys.byBusiness(
      businessId,
      (filters ?? {}) as Record<string, unknown>,
    ),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Booking>>(
        `/bookings/businesses/${businessId}`,
        { params: filters },
      );
      return data;
    },
    enabled: !!businessId,
  });
}

export function useChangeBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    AxiosError,
    { bookingId: string; status: BookingStatus }
  >({
    mutationFn: async ({ bookingId, status }) => {
      const { data } = await api.patch<Booking>(
        `/bookings/${bookingId}/status`,
        { status },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
