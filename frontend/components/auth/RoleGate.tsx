"use client";

import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

interface RoleGateProps {
  allowed: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allowed, children, fallback = null }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || !allowed.includes(user.role)) {
    return (
      <>
        {fallback ?? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso denegado
            </h2>
            <p className="text-gray-500">
              No tienes permisos para acceder a esta sección.
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
