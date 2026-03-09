import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/axios";
import type { User } from "@/types/user";
import type { Role } from "@/types/auth";
import type { PaginatedResponse } from "@/types/common";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

interface UseUsersParams {
  page?: number;
  limit?: number;
}

export function useUsers(params?: UseUsersParams) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: userKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>("/users", {
        params,
      });
      return data;
    },
  });
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, { userId: string; role: Role }>({
    mutationFn: async ({ userId, role }) => {
      const { data } = await api.patch<User>(`/users/${userId}/role`, {
        role,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
