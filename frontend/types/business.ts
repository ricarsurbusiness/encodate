import type { Service } from "./service";

export interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessWithServices extends Business {
  services: Service[];
}

export interface CreateBusinessPayload {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>;
