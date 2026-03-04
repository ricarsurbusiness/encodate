export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;
