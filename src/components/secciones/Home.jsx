import { useState, useEffect } from "react";
import axios from 'axios';
// Si usaras Context API, aquí importarías el estado global

const Home = () => {
  // Estos estados en el futuro vendrán de tu base de datos MongoDB
  const [ventaActiva, setVentaActiva] = useState(false);
  const [mensajeAdmin, setMensajeAdmin] = useState("");

  useEffect(() => {
    const traerConfig = async () => {
      try {
        const res = await axios.get('https://back-lenos.onrender.com/api/config');
        setVentaActiva(res.data.ventaActiva);
        setMensajeAdmin(res.data.mensajeAdmin);
      } catch (error) {
        console.log("Detalles del error:", error.response || error);
        console.error("Error al cargar configuración");
      }
    };
    traerConfig();
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6 py-12"
    >
      {/* Banner Principal */}
      <div className="mb-10">
        <h1 className="text-5xl font-black text-amber-800 mb-4 tracking-tighter">
          LEÑOS RELLENOS
        </h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto font-medium">
          Tradición y sabor de Dolores Hidalgo.
        </p>
      </div>

      {/* --- ESTADO DINÁMICO (Sincronizado con Admin) --- */}
      <div className={`max-w-md w-full mb-12 p-1 rounded-2xl shadow-xl transition-all duration-500 ${
        ventaActiva ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-red-500 to-orange-600"
      }`}>
        <div className="bg-white rounded-xl p-6">
          <div className="flex justify-center mb-3">
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              ventaActiva ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {ventaActiva ? "• Servicio Activo" : "• Cerrado Temporalmente"}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {ventaActiva ? "¡Estamos listos!" : "Aviso Importante"}
          </h2>
          
          <p className="text-gray-600 italic">
            "{mensajeAdmin}"
          </p>

          {ventaActiva && (
            <button className="mt-4 text-amber-700 font-bold hover:underline flex items-center justify-center w-full gap-2">
              Haz tu pedido ahora <span className="animate-bounce">→</span>
            </button>
          )}
        </div>
      </div>

      {/* Accesos rápidos con estilo mejorado */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        <AccesoRapido 
          titulo="Menú" 
          desc="Explora nuestros leños y aguas frescas." 
          link="/menu" 
          emoji="🌮"
        />
        <AccesoRapido 
          titulo="Mi Pedido" 
          desc="Rastrea el estado de tu orden actual." 
          link="/mispedidos" 
          emoji="🛵"
        />
        <AccesoRapido 
          titulo="Nosotros" 
          desc="Horarios, ubicación y contacto." 
          link="/about" 
          emoji="📍"
        />
      </div>
    </section>
  );
};

// Sub-componente para mantener el código limpio
const AccesoRapido = ({ titulo, desc, link, emoji }) => (
  <a href={link} className="group bg-white border border-gray-100 shadow-sm rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left">
    <span className="text-3xl mb-4 block">{emoji}</span>
    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700">{titulo}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </a>
);

export default Home;
