"use client";

import type { Business } from "@/types/business";
import { BusinessCard } from "./BusinessCard";

interface BusinessListProps {
  businesses: Business[];
  showOwnerActions?: boolean;
  onDelete?: (id: string) => void;
}

export function BusinessList({
  businesses,
  showOwnerActions,
  onDelete,
}: BusinessListProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontraron negocios.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          showOwnerActions={showOwnerActions}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
