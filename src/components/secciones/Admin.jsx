import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function AdminPanel() {
  const [tabActiva, setTabActiva] = useState("stock"); // 'stock' o 'pedidos'
  const [ventaActiva, setVentaActiva] = useState(false);
  const [mensajeHome, setMensajeHome] = useState("¡Hoy no abrimos por mantenimiento!");

  useEffect(() => {
  const role = localStorage.getItem('user-role');
  if (role !== 'admin') {
    navigate("/"); // Lo saca si no es admin
  }
}, []);

  const guardarCambiosConfig = async () => {
  try {
    const token = localStorage.getItem('x-auth-token');
    await axios.patch('https://back-lenos.onrender.com/api/admin', 
      { ventaActiva, mensajeAdmin: mensajeHome }, // 'mensajeHome' es tu estado local del input
      { headers: { 'x-auth-token': token } }
    );
    alert("¡Tienda actualizada para todos los clientes!");
  } catch (error) {
    alert("Error al guardar la configuración");
  }
};
// Stock con IDs corregidos
const [stock, setStock] = useState([]);
const [pedidosGestion, setPedidosGestion] = useState([]);
const [cargando, setCargando] = useState(true);
const navigate = useNavigate();

useEffect(() => {
  const cargarDatosAdmin = async () => {
    try {
      const token = localStorage.getItem('x-auth-token');
      const headers = { headers: { 'x-auth-token': token } };

      // Traemos productos y pedidos en paralelo
      const [resProductos, resPedidos] = await Promise.all([
        axios.get('http://localhost:5000/api/products'), 
        axios.get('http://localhost:5000/api/orders', headers)
      ]);

      setStock(resProductos.data);
      setPedidosGestion(resPedidos.data);
    } catch (error) {
      console.error("Error cargando datos administrativos");
    } finally {
      setCargando(false);
    }
  };
  cargarDatosAdmin();
}, []);
 const actualizarCantidad = async (id, nuevaCantidad) => {
  try {
    const token = localStorage.getItem('x-auth-token');
    
    // Petición al backend
    await axios.patch(`http://localhost:5000/api/products/${id}`, 
      { stock: nuevaCantidad }, 
      { headers: { 'x-auth-token': token } }
    );

    // Actualizamos el estado local para que la UI se refresque solita
    setStock(prevStock => 
      prevStock.map(item => item._id === id ? { ...item, stock: nuevaCantidad } : item)
    );
  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("No se pudo actualizar el stock en el servidor");
  }
};

  // Ejemplo en AdminPanel.js
  const cambiarEstadoPedido = async (id, nuevoEstado) => {
  try {
    const token = localStorage.getItem('x-auth-token');
    const res = await axios.patch(`http://localhost:5000/api/orders/${id}`, 
      { estado: nuevoEstado },
      { headers: { 'x-auth-token': token } }
    );

    if (res.status === 200) {
      // Actualizamos el estado local para que el cambio sea instantáneo en la UI
      setPedidosGestion(prevPedidos => 
        prevPedidos.map(p => p._id === id ? { ...p, estado: nuevoEstado } : p)
      );
    }
  } catch (error) {
    alert("Error al cambiar el estado del pedido");
  }
};

  return (
    <section className="py-10 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-black text-amber-800 mb-8 text-center uppercase tracking-tighter">
          Control Maestro Administrativo
        </h2>

        {/* --- NAVEGACIÓN DE PESTAÑAS --- */}
        <div className="flex mb-6 bg-white rounded-xl shadow-sm p-1 overflow-hidden">
          <button
            onClick={() => setTabActiva("stock")}
            className={`flex-1 py-3 font-bold rounded-lg transition ${tabActiva === "stock" ? "bg-amber-600 text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}
          >
            📦 Inventario y Tienda
          </button>
          <button
            onClick={() => setTabActiva("pedidos")}
            className={`flex-1 py-3 font-bold rounded-lg transition ${tabActiva === "pedidos" ? "bg-amber-600 text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}
          >
            🛵 Gestión de Pedidos
          </button>
        </div>

        {/* --- CONTENIDO: STOCK Y TIENDA --- */}
        {tabActiva === "stock" && (
          <div className="space-y-6">
            {/* Estado de Venta y Mensaje */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-amber-500">
                <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm">Estado del Servicio</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${ventaActiva ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {ventaActiva ? "ABIERTO" : "CERRADO"}
                  </span>
                  <button
                    onClick={() => setVentaActiva(!ventaActiva)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${ventaActiva ? "bg-red-500" : "bg-green-600"}`}
                  >
                    {ventaActiva ? "Cerrar Venta" : "Abrir Venta"}
                  </button>
                </div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">MENSAJE PARA CLIENTES (HOME)</label>
                <input
                  type="text"
                  value={mensajeHome}
                  onChange={(e) => setMensajeHome(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Ej. ¡Ya estamos listos!"
                />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center border-t-4 border-blue-500">
                <p className="text-gray-500 text-sm">Los cambios en el stock se reflejan inmediatamente en el menú del cliente.</p>
                <button onClick={guardarCambiosConfig} className="mt-4 bg-gray-800 text-white px-8 py-2 rounded-lg font-bold hover:bg-black transition">
                  Guardar Global
                </button>
              </div>
            </div>

            {/* Tabla de Stock */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase">
                    <th className="p-4 text-left">Producto</th>
                    <th className="p-4 text-center">Cantidad Disponible</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stock.map((item) => (
                  <tr key={item._id} className="hover:bg-amber-50/30 transition">
                    <td className="p-4 font-semibold text-gray-700">{item.nombre}</td>
                    <td className="p-4 text-center">
                    <input
                    type="number"
                    // Cambia 'item.cantidad' por 'item.stock' (según tu modelo de Mongo)
                    value={item.stock || 0} 
                    // Cambia 'item.id' por 'item._id'
                    onChange={(e) => actualizarCantidad(item._id, parseInt(e.target.value))}
                    className="w-20 border rounded-lg p-2 text-center font-bold text-amber-700"
                    />
                    </td>
                    <td className="p-4 text-center">
                    {/* Botón funcional para agotar rápido */}
                    <button 
                    onClick={() => actualizarCantidad(item._id, 0)}
                    className="text-xs text-red-500 font-bold hover:underline"
                    >
                    Agotar
                       </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- CONTENIDO: GESTIÓN DE PEDIDOS --- */}
        {tabActiva === "pedidos" && (
          <div className="grid gap-4">
            {pedidosGestion.map((pedido) => (
              <div key={pedido._id} className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-amber-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-lg">#{pedido._id}</span>
                    <span className="text-gray-400 text-sm">| {pedido.cliente}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 italic">
                    {Array.isArray(pedido.items) 
                    ? pedido.items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")
                    : pedido.items}
                  </p>
                  <p className="text-amber-800 font-bold">${pedido.total}.00</p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Cambiar Estado</label>
                  <select
                    value={pedido.estado}
                    onChange={(e) => cambiarEstadoPedido(pedido._id, e.target.value)}
                    className="p-2 border rounded-lg font-bold text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="En elaboración">👨‍🍳 En elaboración</option>
                    <option value="En reparto">🛵 En reparto</option>
                    <option value="Entregado">✅ Entregado</option>
                  </select>
                </div>
              </div>
            ))}
            {pedidosGestion.length === 0 && (
              <p className="text-center py-10 text-gray-400 italic">No hay pedidos pendientes hoy.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}