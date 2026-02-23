export const CTASection = () => {
  return (
    <section className="relative bg-slate-900 py-14 flex items-center overflow-hidden min-h-[400px]">
      
      {/* Texto izquierda */}
      <div className="w-2/5 relative z-10 px-16 ml-35">
        <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
          For Business Owners
        </span>
        <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
          Grow your business with Encodate
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Join thousands of businesses that use our platform to manage
          appointments, attract new customers, and streamline operations.
        </p>
        <div className="flex gap-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            List Your Business
          </button>
          <button className="border border-slate-600 hover:border-slate-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Imagen lado derecho */}
      <div className="absolute top-0 right-0 h-full w-2/5">
        {/* gradiente — faltaba bg-gradient-to-r */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-900 to-transparent z-10" />
        <img
          src="/owner_business.png"
          alt="Business owner"
          className="w-full h-full object-cover object-left"
        />
      </div>

    </section>
  );
};