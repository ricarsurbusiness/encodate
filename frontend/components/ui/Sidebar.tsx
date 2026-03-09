'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Building2,
  Calendar,
  User,
  LogOut,
  Shield,
  ArrowLeft,
} from 'lucide-react'
import { Role } from '@/types/auth'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  const handleItemClick = () => {
    onClose?.()
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">ENCODATE</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link
          href="/"
          onClick={handleItemClick}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <Link
          href="/dashboard"
          onClick={handleItemClick}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
        >
          <LayoutDashboard size={18} />
          Inicio
        </Link>

        <Link
          href="/dashboard/businesses"
          onClick={handleItemClick}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
        >
          <Building2 size={18} />
          Negocios
        </Link>

        <Link
          href="/dashboard/bookings"
          onClick={handleItemClick}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
        >
          <Calendar size={18} />
          Reservas
        </Link>

        <Link
          href="/dashboard/profile"
          onClick={handleItemClick}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
        >
          <User size={18} />
          Perfil
        </Link>

        {user?.role === Role.ADMIN && (
          <Link
            href="/dashboard/admin/users"
            onClick={handleItemClick}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
          >
            <Shield size={18} />
            Admin – Usuarios
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
