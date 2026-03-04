"use client";

import { useBusinesses } from "@/hooks/useBusinesses";
import { BusinessList } from "@/components/ui/BusinessList";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { CTASection } from "@/components/ui/CtaSection";
import { Footer } from "@/components/ui/Footer";
import { Pagination } from "@/components/ui/Pagination";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBusinesses({ page, limit: 6 });

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-8 py-12">
        <HeroSection />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <BusinessList businesses={data?.data ?? []} />
            {data?.meta && (
              <Pagination
                currentPage={data.meta.page}
                totalPages={data.meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}
