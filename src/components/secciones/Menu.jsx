// src/components/MenuComida.jsx
import { useState, useEffect } from "react";

// Sub-componente para evitar repetir lógica de cantidad
const TarjetaProducto = ({ item, alAgregar }) => {
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
      <div>
        <img src={item.img} alt={item.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
        <h4 className="text-xl font-semibold text-gray-700">{item.nombre}</h4>
        {item.descripcion && <p className="text-gray-500 text-sm mb-2">{item.descripcion}</p>}
        <span className="text-amber-900 font-bold block mb-3">{item.precio}</span>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <label className="text-sm text-gray-600">Cant:</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
            className="w-16 border rounded p-1 text-center"
          />
        </div>
        <button
          onClick={() => {
            alAgregar({ ...item, cantidad });
            setCantidad(1); // Opcional: resetear a 1 tras agregar
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

const Menu = () => {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guardar en LocalStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (itemConCantidad) => {
    setCarrito((prevCarrito) => {
      // ¿Ya existe este leño en el carrito?
      const itemExiste = prevCarrito.find(i => i.nombre === itemConCantidad.nombre);

      if (itemExiste) {
        // Si existe, sumamos la cantidad nueva a la anterior
        return prevCarrito.map(i =>
          i.nombre === itemConCantidad.nombre
            ? { ...i, cantidad: i.cantidad + itemConCantidad.cantidad }
            : i
        );
      }
      // Si es nuevo, lo agregamos normal
      return [...prevCarrito, itemConCantidad];
    });
    
    alert(`¡${itemConCantidad.cantidad}x ${itemConCantidad.nombre} al carrito!`);
  };

  const platillosClasicos = [
    { nombre: "Leño Hawiano", precio: 40.00, descripcion: "Piña, jamón y queso fundido", img: "/src/assets/imgMenu/leno-hawiano.png" },
    { nombre: "Leño de Pastor", precio: 40.00, descripcion: "Carne al pastor con piña y cebolla", img: "/src/assets/imgMenu/leno-pastor.png" },
    { nombre: "Leño de Salchicha con Chorizo", precio: 40.00, descripcion: "Salchicha y chorizo dorados al comal", img: "/src/assets/imgMenu/leno-salchicha.png" },
  ];

  const platillosEspeciales = [
    { nombre: "Leño Tocho Morocho", precio: 50.00, descripcion: "Salchicha, tocino, jamón, chorizo y trozos de piña", img: "/src/assets/imgMenu/leno-tocho.png" },
    { nombre: "Leño de Bistec", precio: 50.00, descripcion: "Bistec con chile morrón y tocino", img: "/src/assets/imgMenu/leno-bistec.png" },
  ];


  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10">Nuestro Menú</h2>

        {/* Clásicos */}
        <h3 className="text-2xl font-bold text-amber-800 mb-6 uppercase tracking-wider">Clásicos</h3>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {platillosClasicos.map((item, index) => (
            <TarjetaProducto key={index} item={item} alAgregar={agregarAlCarrito} />
          ))}
        </div>

        {/* Especiales */}
        <h3 className="text-2xl font-bold text-amber-800 mb-6 uppercase tracking-wider">Especiales</h3>
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {platillosEspeciales.map((item, index) => (
            <TarjetaProducto key={index} item={item} alAgregar={agregarAlCarrito} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
