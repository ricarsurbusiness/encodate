"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import BookingList from "./components/BookingList";
import Link from "next/link";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const handleCancel = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "CANCELLED" }
          : booking,
      ),
    );
  };
  const handleUpdate = (updatedBooking: any) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)),
    );
  };
  const fetchBookings = async (pageNumber: number) => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `bookings/my-bookings?page=${pageNumber}&limit=5`,
      );
      console.log("Bookings from API:", data.data);
      setBookings(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Volver al inicio
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Mis reservas</h1>
      <p className="text-sm text-gray-500 mb-6">
        Viendo {bookings.length} de {meta?.total ?? 0} reservas
      </p>
      <BookingList
        bookings={bookings}
        meta={meta}
        onPageChange={setPage}
        onCancelSuccess={handleCancel}
        onUpdateSuccess={handleUpdate}
      />
    </div>
  );
}
