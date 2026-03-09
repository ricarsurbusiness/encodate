'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Calendar,
  User,
  LogOut,
  Loader2,
  Shield,
  Menu,
} from 'lucide-react'
import { Role } from '@/types/auth'
import Sidebar from '@/components/ui/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout, loading, isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth guard — defense-in-depth behind middleware
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header con Hamburger */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
