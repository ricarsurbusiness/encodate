import Link from "next/link";
import type { Business } from "@/types/business";

interface BusinessCardProps {
  business: Business;
  serviceCount?: number;
  showOwnerActions?: boolean;
  onDelete?: (id: string) => void;
}

export const BusinessCard = ({
  business,
  serviceCount,
  showOwnerActions,
  onDelete,
}: BusinessCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden hover:shadow-md transition-all duration-200">
      <Link href={`/businesses/${business.id}`}>
        <div className="cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900">{business.name}</h2>

          {business.description && (
            <p className="text-gray-600 mt-2 line-clamp-2">
              {business.description}
            </p>
          )}

          <div className="mt-3 space-y-1">
            {business.address && (
              <p className="text-sm text-gray-500">📍 {business.address}</p>
            )}
            {business.phone && (
              <p className="text-sm text-gray-500">📞 {business.phone}</p>
            )}
          </div>

          {serviceCount !== undefined && (
            <p className="text-sm text-blue-600 mt-3 font-medium">
              {serviceCount} {serviceCount === 1 ? "servicio" : "servicios"}
            </p>
          )}

          <div className="mt-4 text-blue-600 font-semibold text-sm">
            Ver detalles →
          </div>
        </div>
      </Link>

      {showOwnerActions && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          <Link
            href={`/businesses/${business.id}/edit`}
            className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Editar
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(business.id)}
              className="text-sm px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
