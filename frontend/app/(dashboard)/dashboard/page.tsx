"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMyBusinesses } from "@/hooks/useBusinesses";
import { Building2, Calendar, Loader2, Plus } from "lucide-react";
import { Role } from "@/types/auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: businesses, isLoading } = useMyBusinesses();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenido a tu panel de administración
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Negocios
            </h3>
          </div>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-300 mt-2" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              {businesses?.length ?? 0}
            </p>
          )}
        </div>

        <Link
          href="/dashboard/bookings"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Reservas
            </h3>
          </div>
          <p className="text-sm text-blue-600 group-hover:underline">
            Ver reservas →
          </p>
        </Link>

        <Link
          href="/businesses/create"
          className="bg-blue-50 rounded-2xl border border-blue-100 p-6 hover:bg-blue-100 transition group flex flex-col justify-center items-center text-center"
        >
          <Plus className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm font-medium text-blue-700">Crear negocio</p>
        </Link>
      </div>

      {/* My businesses quick list */}
      {!isLoading && businesses && businesses.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Mis negocios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businesses.slice(0, 4).map((b) => (
              <Link
                key={b.id}
                href={`/businesses/${b.id}`}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900">{b.name}</h3>
                {b.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}
                {b.address && (
                  <p className="text-xs text-gray-400 mt-2">📍 {b.address}</p>
                )}
              </Link>
            ))}
          </div>
          {businesses.length > 4 && (
            <Link
              href="/dashboard/businesses"
              className="text-sm text-blue-600 hover:underline mt-4 inline-block"
            >
              Ver todos ({businesses.length}) →
            </Link>
          )}
        </div>
      )}

      {user?.role === Role.ADMIN && (
        <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <p className="text-sm text-purple-700">
            🔒 Tienes permisos de administrador.{" "}
            <Link
              href="/dashboard/admin/users"
              className="font-medium underline"
            >
              Gestionar usuarios
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
