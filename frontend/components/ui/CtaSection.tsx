export const CTASection = () => {
  return (
    <section className="py-12 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Content - Left */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-4">
              For Business Owners
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-snug">
              Grow your business with Encodate
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of businesses that use our platform to manage
              appointments, attract new customers, and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200">
                List Your Business
              </button>
              <button className="border border-slate-500 hover:border-slate-300 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>

          {/* Image - Right (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:block flex-1">
            <img 
              src="/owner_business.png" 
              alt="Business owner"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};