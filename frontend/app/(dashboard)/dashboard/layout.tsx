"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Calendar,
  Users,
  User,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <Image></Image>
          <h2 className="text-2xl font-bold mb-10">ENCODATE</h2>

          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/dashboard/businesses"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              <Building2 size={18} />
              Businesses
            </Link>

            <Link
              href="/dashboard/services"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              <Briefcase size={18} />
              Services
            </Link>

            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              <Calendar size={18} />
              Bookings
            </Link>

            <Link
              href="/dashboard/staff"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              <Users size={18} />
              Staff
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
            >
              <User size={18} />
              Profile
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
