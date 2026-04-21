import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <--- Esta es la línea que falta
import axios from "axios";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate(); // Importar de 'react-router-dom'

  useEffect(() => {
  const obtenerPedidos = async () => {
    try {
      const token = localStorage.getItem('x-auth-token');
      if (!token) return console.error("No hay token");
      const res = await axios.get('https://back-lenos.onrender.com/api/orders', {
        headers: { 'x-auth-token': token }
      });
      setPedidos(res.data);
    } catch (error) {
      console.error("Error al traer pedidos:", error);
    } finally {
      setCargando(false);
    }
  };
  obtenerPedidos();
  }, []);

  const calcularTotal = (items) => items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Función para repetir el pedido
  const volverAOrdenar = (pedido) => {
  // Tomamos los items del pedido viejo
  const nuevosItems = pedido.items.map(item => ({
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad
  }));

  // Guardamos en localStorage para el Carrito.jsx
  localStorage.setItem("carrito", JSON.stringify(nuevosItems));
  
  // Redirigimos al carrito para que confirme
  navigate("/carrito");
};

  const pedidoActual = pedidos.find(p => p.estado !== "Entregado");
  const historial = pedidos.filter(p => p.estado === "Entregado");
    
    return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800">Mis Pedidos</h2>

      {/* --- SECCIÓN: ESTADO DEL PEDIDO ACTUAL --- */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 text-amber-700 flex items-center">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          Pedido en curso
        </h3>
        
        {pedidoActual ? (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-amber-800 font-semibold uppercase">Estado Actual:</p>
                <p className="text-2xl font-black text-amber-900">{pedidoActual.estado}</p>
              </div>
              <span className="bg-amber-200 text-amber-800 py-1 px-3 rounded-full text-sm font-bold">
                #{pedidoActual._id.slice(-6)} {/* Mostramos los últimos 6 dígitos del ID de Mongo */}
              </span>
            </div>

            <div className="w-full bg-amber-200 rounded-full h-2.5 mb-6">
              <div 
                className="bg-amber-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ 
                    width: pedidoActual.estado === "Pendiente" ? "30%" : 
                           pedidoActual.estado === "En elaboración" ? "60%" : "100%" 
                }}
              ></div>
            </div>

            <div className="space-y-2">
              {pedidoActual.items.map((item, i) => (
                <div key={i} className="flex justify-between text-gray-700">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-amber-200 pt-2 mt-2 flex justify-between font-bold text-lg text-amber-900">
                <span>Total</span>
                <span>${pedidoActual.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No tienes pedidos activos en este momento.</p>
        )}
      </section>

      <hr className="mb-12 border-gray-200" />

      {/* --- SECCIÓN: HISTORIAL DE PEDIDOS --- */}
      <section>
        <h3 className="text-xl font-bold mb-6 text-gray-700">Historial de Pedidos</h3>
        
        <div className="space-y-6">
          {historial.length === 0 ? (
            <p className="text-gray-500">Aún no has completado ningún pedido.</p>
          ) : (
            historial.map((pedido) => (
              <div key={pedido._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                  <span className="font-bold text-gray-700">Pedido #{pedido._id.slice(-6)}</span>
                  <span className="text-sm text-gray-500">{new Date(pedido.fecha).toLocaleDateString()}</span>
                </div>

                <div className="p-6">
                  <table className="w-full text-left mb-6">
                    <thead>
                      <tr className="text-xs uppercase text-gray-400 border-b">
                        <th className="pb-2 font-medium">Cant.</th>
                        <th className="pb-2 font-medium">Producto</th>
                        <th className="pb-2 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {pedido.items.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 font-bold">{item.cantidad}</td>
                          <td className="py-3 font-medium text-gray-800">{item.nombre}</td>
                          <td className="py-3 text-right font-semibold">${(item.precio * item.cantidad).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="text-right w-full md:w-auto">
                      <p className="text-xs text-gray-400 uppercase">Total Pagado</p>
                      <p className="text-xl font-bold text-gray-900">${pedido.total.toFixed(2)}</p>
                    </div>
                    
                    <button
                      onClick={() => volverAOrdenar(pedido)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-700 active:scale-95 transition-all shadow-md"
                    >
                      <span>🔄</span> Volver a ordenar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}