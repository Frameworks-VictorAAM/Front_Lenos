import { useState, useEffect } from "react";
import axios from "axios";

export default function Carrito() {
  // 1. HOOKS SIEMPRE AL PRINCIPIO
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("Invitado");
  const [paso, setPaso] = useState("carrito");
  const cantidadTotalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const minimoRequerido = 3;

  // Autollenado de datos del usuario
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      setNombreUsuario(userData.username || "Usuario");
      // Aquí usamos .phone porque así viene de tu base de datos (según tu imagen)
      if (userData.phone) setTelefono(userData.phone);
    }
  }, []);

  // 2. CÁLCULOS
  const total = carrito.reduce((acc, item) => {
    const precioNumerico = typeof item.precio === "string" 
      ? parseFloat(item.precio.replace("$", "")) 
      : item.precio;
    return acc + precioNumerico * item.cantidad;
  }, 0);

  // 3. ENVIAR PEDIDO
  const enviarPedidoAMongo = async () => {
    if (!direccion.trim()) return alert("Ingresa una dirección");

    const datosPedido = {
      cliente: nombreUsuario,
      telefono: telefono, // Se envía como 'phone' para que coincida con tu Schema
      direccion: direccion,
      items: carrito,
      total: total,
    };
    enviarWhatsApp();

    try {
      const token = localStorage.getItem("x-auth-token");
      await axios.post("https://back-lenos.onrender.com/api/orders", datosPedido, {
        headers: { "x-auth-token": token }
      });
      
      alert("¡Pedido enviado!");
      localStorage.removeItem("carrito");
      setCarrito([]);
      setPaso("confirmado");
    } catch (error) {
      alert("Error al enviar pedido. Verifica tu sesión.");
    }
  };

  const enviarWhatsApp = () => {
  const numeroNegocio = "524181329304"; // Sustituye por tu número real (incluye código de país)
  
  
  // 1. Formateamos la lista de productos

  const nombreUsuario = localStorage.getItem('user-name') || "Cliente";
  const listaProductos = carrito.map(item => 
    `- ${item.cantidad}x ${item.nombre} ($${(item.precio * item.cantidad).toFixed(2)})`
  ).join('%0A');

  // 2. Calculamos el total
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // 3. Creamos el mensaje (codificado para URL)
  const mensaje = `¡Hola! Me gustaría hacer un pedido:%0A%0A${listaProductos}%0A%0A*Total: $${total.toFixed(2)}*%0A%0A_Pedido de: ${nombreUsuario}_`;

  // 4. Construimos la URL de WhatsApp
  const url = `https://wa.me/${numeroNegocio}?text=${mensaje}`;

  // 5. Abrimos en una nueva pestaña
  window.open(url, '_blank');
};

  // 4. RENDERS CONDICIONALES
  if (paso === "confirmado") {
    return (
      <div className="text-center py-20">
        <h2 className="text-4xl font-black text-green-600">¡LISTO! ✅</h2>
        <p className="mt-4">Tu pedido llegará pronto a tu dirección.</p>
        <button onClick={() => window.location.href="/"} className="mt-6 bg-amber-700 text-white px-6 py-2 rounded-lg">Volver</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h2 className="text-3xl font-black text-gray-800 uppercase">Tu Carrito</h2>
      <p className="text-amber-700 font-bold mb-6 italic">Ordenando como: {nombreUsuario}</p>

      {carrito.length === 0 ? (
        <p className="text-center py-10 text-gray-400">Carrito vacío...</p>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
          {/* Listado de items */}
          <ul className="mb-6 divide-y divide-gray-100">
            {carrito.map((item, index) => (
              <li key={index} className="py-4 flex justify-between">
                <span>{item.cantidad}x {item.nombre}</span>
                <span className="font-bold">${(item.precio * item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Formulario */}
          <div className="bg-amber-50 p-4 rounded-xl mb-6 space-y-3">
            <input
              type="text"
              placeholder="Dirección completa"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <input
              type="text"
              placeholder="Teléfono de contacto"
              value={telefono} // <--- YA NO DARÁ ERROR PORQUE EXISTE EL ESTADO telefono
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500">Total:</span>
            <span className="text-3xl font-black text-amber-800">${total.toFixed(2)}</span>
          </div>
          {/* Mensaje de aviso si faltan leños */}
          {cantidadTotalItems < minimoRequerido && (
            <p className="text-red-600 text-sm font-bold mb-4 bg-red-50 p-3 rounded-lg border border-red-200 text-center">
              ⚠️ Debes pedir al menos {minimoRequerido} leños para continuar. 
              (Te faltan {minimoRequerido - cantidadTotalItems})
            </p>
          )}

          <button
            onClick={enviarPedidoAMongo}
              disabled={cantidadTotalItems < minimoRequerido} // Bloqueo técnico
              className={`w-full py-4 rounded-xl font-bold transition ${
              cantidadTotalItems < minimoRequerido 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Estilo deshabilitado
              : "bg-amber-600 text-white hover:bg-amber-700 shadow-lg" // Estilo activo
              }`}
            >
          {cantidadTotalItems < minimoRequerido 
            ? `MÍNIMO ${minimoRequerido} LEÑOS` 
            : "CONFIRMAR Y PEDIR 🔥"}
          </button>
        </div>
      )}
    </div>
  );
}