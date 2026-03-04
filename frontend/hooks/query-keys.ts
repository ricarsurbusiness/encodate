export const businessKeys = {
  all: ["businesses"] as const,
  lists: () => [...businessKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...businessKeys.lists(), params] as const,
  details: () => [...businessKeys.all, "detail"] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
  my: () => [...businessKeys.all, "my"] as const,
};

export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...serviceKeys.lists(), params] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
  byBusiness: (businessId: string) =>
    [...serviceKeys.all, "business", businessId] as const,
};

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...bookingKeys.lists(), params] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  my: () => [...bookingKeys.all, "my"] as const,
  byBusiness: (businessId: string, params?: Record<string, unknown>) =>
    [...bookingKeys.all, "business", businessId, ...(params ? [params] : [])] as const,
};
