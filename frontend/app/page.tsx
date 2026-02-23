import { BusinessList } from "@/components/ui/BusinessListt";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";



export default async function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-8 py-12">
        <HeroSection />
        <BusinessList />
      </main>
    </div>
  );
}
