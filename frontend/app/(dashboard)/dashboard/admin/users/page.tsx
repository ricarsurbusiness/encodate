"use client";

import { useState } from "react";
import { Loader2, Shield, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { useUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";
import type { User } from "@/types/user";

// ── Role badge ───────────────────────────────────────────────────

const roleStyles: Record<Role, string> = {
  [Role.ADMIN]: "bg-purple-100 text-purple-700",
  [Role.STAFF]: "bg-blue-100 text-blue-700",
  [Role.CLIENT]: "bg-gray-100 text-gray-700",
};

const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.STAFF]: "Staff",
  [Role.CLIENT]: "Cliente",
};

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}

// ── User row ─────────────────────────────────────────────────────

function UserRow({
  user,
  currentUserId,
}: {
  user: User;
  currentUserId: string;
}) {
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const [changingRole, setChangingRole] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSelf = user.id === currentUserId;

  const handleRoleChange = async (newRole: Role) => {
    if (newRole === user.role) return;
    setChangingRole(true);
    try {
      await updateRole.mutateAsync({ userId: user.id, role: newRole });
      toast.success(`Rol de ${user.name} actualizado a ${roleLabels[newRole]}`);
    } catch {
      toast.error("Error al cambiar el rol");
    } finally {
      setChangingRole(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success(`Usuario "${user.name}" eliminado`);
    } catch {
      toast.error("Error al eliminar el usuario");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {user.phone || "—"}
      </td>
      <td className="py-3 px-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        {isSelf ? (
          <span className="text-xs text-gray-400 italic">Tú</span>
        ) : (
          <div className="flex items-center gap-2">
            {changingRole ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={Role.CLIENT}>Cliente</option>
                <option value={Role.STAFF}>Staff</option>
                <option value={Role.ADMIN}>Admin</option>
              </select>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
              title="Eliminar usuario"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useUsers({ page, limit });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-7 h-7 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 mt-1">
            Administra roles y usuarios del sistema
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Registrado</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUserId={currentUser?.id ?? ""}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>
                Página {meta.page} de {meta.totalPages} ({meta.total} usuarios)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Anterior
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
