"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if(!totalPages || totalPages <= 1) return null;
  const getPages = () => {
    // Siempre muestra: primera, última, actual y sus vecinos
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-8">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Números */}
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
              ${
                currentPage === page
                  ? "bg-blue-500 text-white border border-blue-500"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-500"
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};