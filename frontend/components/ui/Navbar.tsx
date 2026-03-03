"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();

  // Show minimal navbar while auth state is loading
  if (loading) {
    return (
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/logoEncodate.png"
                alt="ENCODATE logo"
                width={50}
                height={50}
              />
              <h1 className="font-bold text-lg">ENCODATE</h1>
            </div>
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2">
            <Image
              src="/logoEncodate.png"
              alt="ENCODATE logo"
              width={50}
              height={50}
            />
            <h1 className="font-bold text-lg">ENCODATE</h1>
          </div>

          {/* Links centrales */}
          <div className="flex gap-10">
            <Link href="/explore" className="text-gray-600 hover:text-blue-600">
              Explore
            </Link>
            <Link
              href="/for-business"
              className="text-gray-600 hover:text-blue-600"
            >
              For Business
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">
              Blog
            </Link>
          </div>

          {/* Lado derecho */}
          <div className="flex gap-4 items-center">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="rounded bg-white px-4 py-2 text-black hover:text-blue-400"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded bg-blue-700 px-4 py-2 text-white"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/my-bookings"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Mis reservas
                </Link>

                <span className="text-sm text-gray-500">{user?.name}</span>

                <button
                  onClick={logout}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
