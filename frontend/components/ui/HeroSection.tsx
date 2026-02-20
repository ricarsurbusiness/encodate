import {Search} from 'lucide-react';
export const HeroSection = () => {
  return (
    <div className="flex flex-col py-20 px-4 bg-gray-50 text-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Find and book at the best</h1>
        <h1 className="text-4xl text-blue-700 font-bold mb-4">
          local businesses
        </h1>
        <h3 className="text-xl text-gray-600 mb-4 pt-3 pb-2">
          Discover the best local businesses near you
        </h3>
      </div>
     {/* Search Bar */}
      <div className="flex justify-center">
        <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 w-full max-w-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition">
          
          <Search className="text-gray-400 mr-2" size={20} />

          <input
            type="text"
            placeholder="Search for businesses"
            className="flex-1 outline-none bg-transparent"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
