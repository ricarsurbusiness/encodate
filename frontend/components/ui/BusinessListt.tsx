"use client";

import { useState, useEffect } from "react";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { Pagination } from "@/components/ui/Pagination";

interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}

const SIZE_PAGE = 6;

export const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/businesses?page=${currentPage}&limit=${SIZE_PAGE}`
        );
        const json = await response.json();
        console.log("API response:", json);
        if (!json.data || !json.meta) {
  console.error("Respuesta inesperada de la API:", json);
  return;
}
        setBusinesses(json.data);
        setTotalPages(json.meta.totalPages);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [currentPage]); // se vuelve a ejecutar cada vez que cambia la página

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {Array.from({ length: SIZE_PAGE }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-64" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            name={business.name}
            description={business.description}
            address={business.address}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};