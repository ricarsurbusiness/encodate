"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import BookingList from "./components/BookingList";

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
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <p className="text-sm text-gray-500 mb-6">
        Viendo {bookings.length} de {meta?.total ?? 0} bookings
      </p>
      <BookingList
        bookings={bookings}
        meta={meta}
        onPageChange={setPage}
        onCancelSuccess={handleCancel}
      />
    </div>
  );
}
