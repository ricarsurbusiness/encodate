"use client";

import { Clock, DollarSign, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (serviceId: string) => void;
}

export function ServiceCard({
  service,
  onBook,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
      {service.description && (
        <p className="text-gray-600 mt-1 text-sm">{service.description}</p>
      )}

      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {service.price.toFixed(2)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {service.duration} min
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {onBook && (
          <button
            onClick={() => onBook(service.id)}
            className="flex-1 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Reservar
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(service)}
            className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
