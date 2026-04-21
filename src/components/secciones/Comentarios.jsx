import { useState } from 'react';

// Esta es la función que captura el comentario [cite: 12, 13]
export default function SeccionComentarios() {
  const [comentario, setComentario] = useState('');
  const [respuesta, setRespuesta] = useState('');

  const enviarDatos = async (e) => {
  e.preventDefault();
  
  const res = await fetch('https://localhost:8443/api/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // AÑADIMOS 'puntuacion' (en este caso fija en 5, o puedes crear un estado para ella)
    body: JSON.stringify({ 
      texto: comentario, 
      puntuacion: 5 
    })
  });

  const data = await res.json();

  if (!res.ok) {
    // Si hay error, ahora podrás ver en la consola qué campo falló exactamente
    console.log("Errores de validación:", data.errors);
    return;
  }

  // Si el backend responde con 'mensaje', úsalo para la respuesta
  setRespuesta(data.mensaje); 
  setComentario('');
};

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Déjanos un comentario</h2>
      <form onSubmit={enviarDatos}>
        <textarea 
          className="border p-2 w-full rounded"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe aquí..."
        />
        <button type="submit" className="bg-orange-600 text-white p-2 mt-2 rounded">
          Enviar Comentario
        </button>
      </form>

      {/* React escapará etiquetas automáticamente para evitar XSS [cite: 17, 18] */}
      {respuesta && (
        <div className="mt-4 p-2 bg-gray-100 italic">
          <p>Comentario guardado: {respuesta}</p>
        </div>
      )}
    </div>
  );
}