import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/axios";
import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/service";
import type { PaginatedResponse } from "@/types/common";
import { serviceKeys, businessKeys } from "./query-keys";

interface UseBusinessServicesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useBusinessServices(
  businessId: string,
  params?: UseBusinessServicesParams,
) {
  return useQuery<PaginatedResponse<Service>>({
    queryKey: [...serviceKeys.byBusiness(businessId), (params ?? {}) as Record<string, unknown>],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Service>>(
        `/services/businesses/${businessId}/services`,
        { params },
      );
      return data;
    },
    enabled: !!businessId,
  });
}

export function useService(id: string) {
  return useQuery<Service>({
    queryKey: serviceKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Service>(`/services/services/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateService(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation<Service, AxiosError, CreateServicePayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<Service>(
        `/services/businesses/${businessId}/services`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({
        queryKey: businessKeys.detail(businessId),
      });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation<
    Service,
    AxiosError,
    { id: string } & UpdateServicePayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.patch<Service>(`/services/services/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (id) => {
      await api.delete(`/services/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
}
