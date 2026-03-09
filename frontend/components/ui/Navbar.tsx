"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

export const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Show minimal navbar while auth state is loading
  if (loading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/logoEncodate.png"
                alt="ENCODATE logo"
                width={32}
                height={32}
              />
              <h1 className="hidden sm:inline font-bold text-lg">ENCODATE</h1>
            </div>
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logoEncodate.png"
              alt="ENCODATE logo"
              width={32}
              height={32}
            />
            <span className="hidden sm:inline font-bold text-lg">ENCODATE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 items-center">
            <Link href="/businesses" className="text-gray-600 hover:text-blue-600 transition">
              Explorar
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-bookings" className="text-gray-600 hover:text-blue-600 transition">
                  Mis reservas
                </Link>

                {user?.role !== Role.CLIENT && (
                  <Link
                    href="/dashboard/businesses"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Mis negocios
                  </Link>
                )}

                <span className="text-sm text-gray-500">{user?.name}</span>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cerrar sesión
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/businesses"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
              onClick={() => setIsOpen(false)}
            >
              Explorar
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/my-bookings"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Mis reservas
                </Link>

                {user?.role !== Role.CLIENT && (
                  <Link
                    href="/dashboard/businesses"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Mis negocios
                  </Link>
                )}

                <span className="block px-4 py-2 text-sm text-gray-500">
                  {user?.name}
                </span>

                <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
