import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Registro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // --- LÓGICA DE LOGIN REAL ---
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          phone,
          password,
        });
        localStorage.setItem("x-auth-token", res.data.token);
        localStorage.setItem("user-role", res.data.user.role);
        // Guardamos el objeto completo (nombre, rol y teléfono)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        console.log("Respuesta del servidor:", res.data);

        // Guardamos el token en localStorage para que el Carrito lo pueda usar
        localStorage.setItem("x-auth-token", res.data.token);
        localStorage.setItem("user-role", res.data.user.role);
        alert("¡Bienvenido!");
        if (res.data.user.role === 'admin') {
        navigate("/admin"); // Ruta para el panel de gestión
          } else {
            navigate("/carrito"); // Ruta para clientes
          }

      } else {
        // --- LÓGICA DE REGISTRO REAL ---
        await axios.post("http://localhost:5000/api/auth/register", {
          username,
          phone,
          password,
        });

        alert("Usuario registrado con éxito. Ahora inicia sesión.");
        setIsLogin(true); // Cambiamos a la vista de login
      }
    } catch (err) {
      // Si el backend responde con error (ej. usuario ya existe o clave mal)
      const mensajeError = err.response?.data?.msg || "Ocurrió un error";
      alert(mensajeError);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-500 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all">
        {/* Logo o Icono */}
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 p-4 rounded-full">
            <span className="text-4xl">🪵</span>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          {isLogin ? "¡Hola de nuevo!" : "Crear cuenta"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isLogin 
            ? "Ingresa tus credenciales para pedir tus Leños." 
            : "Únete para disfrutar de los mejores sabores."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <input
              type="text"
              placeholder="Ej. JuanPerez123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Campo Teléfono (Solo se muestra en Registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Teléfono</label>
              <input
                type="tel"
                placeholder="10 dígitos"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
              />
            </div>
          )}

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Botón Principal */}
          <button
            type="submit"
            className="w-full bg-amber-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-amber-800 shadow-lg hover:shadow-amber-900/20 transition-all active:scale-95"
          >
            {isLogin ? "Entrar" : "Registrarme"}
          </button>
        </form>

        {/* Cambio entre Login y Registro */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-700 font-bold hover:underline mt-1 focus:outline-none"
          >
            {isLogin ? "Crea una aquí" : "Inicia sesión ahora"}
          </button>
        </div>
      </div>
    </div>
  );
}