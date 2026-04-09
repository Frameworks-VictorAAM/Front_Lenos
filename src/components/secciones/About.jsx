import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaClock, FaEnvelope } from "react-icons/fa";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        
        {/* Encabezado con Estilo */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 tracking-tighter">
            NUESTRA HISTORIA
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Columna de Texto */}
          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed italic">
              "Más que comida, compartimos una tradición que se cocina a fuego lento."
            </p>
            <p className="text-lg text-gray-600">
              En <span className="font-bold text-amber-700 font-serif text-xl">Leños Rellenos</span> nos apasiona compartir el sabor auténtico de nuestra tierra. 
              Cada leño está preparado con ingredientes frescos y recetas tradicionales que reflejan la cultura y el orgullo de <span className="text-amber-800 font-semibold">Dolores Hidalgo</span>.
            </p>
            <p className="text-lg text-gray-600">
              Nuestro compromiso es ofrecerte una experiencia deliciosa y accesible para disfrutar en familia o con amigos, manteniendo siempre la calidez de un hogar mexicano.
            </p>
          </div>

          {/* Columna de Imagen/Tarjeta de Info */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-amber-900/5 border-l-4 border-amber-600 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700"><FaClock size={24}/></div>
              <div>
                <h4 className="font-bold text-gray-800">Horarios de Servicio</h4>
                <p className="text-gray-500">Domingos de 9:00 AM a 6:00 PM</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-amber-900/5 border-l-4 border-amber-600 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700"><FaMapMarkerAlt size={24}/></div>
              <div>
                <h4 className="font-bold text-gray-800">Ubicación</h4>
                <p className="text-gray-500">Calle Principal #123, Dolores Hidalgo, Gto.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-amber-900/5 border-l-4 border-amber-600 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700"><FaEnvelope size={24}/></div>
              <div>
                <h4 className="font-bold text-gray-800">Contacto</h4>
                <p className="text-gray-500">contacto@lenosrellenos.com</p>
                <p className="text-gray-500 font-bold">+52 418 123 4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Mapa / Imagen de Local */}
        <div className="w-full h-64 bg-gray-200 rounded-3xl overflow-hidden shadow-inner relative mb-12">
          {/* Aquí iría el iframe de Google Maps */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <p className="font-bold uppercase tracking-widest">[ Mapa de Google Maps aquí ]</p>
          </div>
        </div>

        {/* Redes sociales y Cierre */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-6">¡Síguenos en nuestras redes!</h3>
          <div className="flex justify-center space-x-8">
            <SocialBtn href="https://facebook.com" color="hover:bg-blue-600" icon={<FaFacebookF />} />
            <SocialBtn href="https://instagram.com" color="hover:bg-pink-500" icon={<FaInstagram />} />
            <SocialBtn href="https://wa.me/5214181234567" color="hover:bg-green-500" icon={<FaWhatsapp />} />
          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-componente para botones de redes sociales
const SocialBtn = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`bg-white text-gray-600 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${color} hover:text-white`}
  >
    <div className="text-2xl">{icon}</div>
  </a>
);

export default About;
