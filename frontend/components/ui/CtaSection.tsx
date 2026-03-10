"use client";

export default function CtaSection() {
  const handleOpenGmail = () => {
    const email = "ricarsurbusiness@gmail.com";
    const subject = "Contacto desde Encodate";
    const body = "Hola, me gustaría contactarme contigo.";

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
  };

  return (
    <section className="w-full py-12 md:py-20">
      <div className="w-full">

        <div className="flex flex-col lg:flex-row overflow-hidden  shadow-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">

          {/* Left Content */}
          <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16">

            <span className="inline-block bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6 w-fit">
              Para Propietarios de Negocios
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Sistematiza tu negocio con Encodate
            </h2>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              Únete a miles de negocios que usan nuestra plataforma para gestionar
              citas, atraer nuevos clientes y optimizar operaciones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">

              <button onClick={handleOpenGmail} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-colors">
                Contáctanos
              </button>

            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-[45%] overflow-hidden">
            <img
              src="/owner_business.png"
              alt="Propietario de negocio"
              className="w-full h-full object-cover "
            />
          </div>

        </div>

      </div>
    </section>
  );
}