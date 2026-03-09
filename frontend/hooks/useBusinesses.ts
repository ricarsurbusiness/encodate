import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/axios";
import type {
  Business,
  BusinessWithServices,
  CreateBusinessPayload,
  UpdateBusinessPayload,
} from "@/types/business";
import type { PaginatedResponse } from "@/types/common";
import { businessKeys } from "./query-keys";

interface UseBusinessesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useBusinesses(params?: UseBusinessesParams) {
  return useQuery<PaginatedResponse<Business>>({
    queryKey: businessKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Business>>(
        "/businesses",
        { params },
      );
      return data;
    },
  });
}

export function useBusiness(id: string) {
  return useQuery<BusinessWithServices>({
    queryKey: businessKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<BusinessWithServices>(
        `/businesses/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useMyBusinesses() {
  return useQuery<Business[]>({
    queryKey: businessKeys.my(),
    queryFn: async () => {
      const { data } = await api.get<Business[]>("/businesses/my-businesses");
      return data;
    },
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation<Business, AxiosError, CreateBusinessPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<Business>("/businesses", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
}

export function useUpdateBusiness(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Business, AxiosError, UpdateBusinessPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.patch<Business>(
        `/businesses/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (id) => {
      await api.delete(`/businesses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
}
