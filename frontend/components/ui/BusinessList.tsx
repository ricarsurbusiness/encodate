"use client";

import type { Business } from "@/types/business";
import { BusinessCard } from "./BusinessCard";
import { Building2 } from "lucide-react";
import Link from "next/link";

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
      <div className="text-center py-16">
        <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium">No se encontraron negocios</p>
        <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda o explora más tarde</p>
        <Link href="/businesses" className="text-sm text-blue-600 hover:underline mt-4 inline-block">
          Ver todos los negocios →
        </Link>
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
