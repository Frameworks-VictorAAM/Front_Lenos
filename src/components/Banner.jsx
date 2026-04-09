import React from "react";
import { Link } from "react-router-dom"; // importa Link
import "./Banner.css"; // estilos del banner

const Banner = () => {
  return (
    <section className="banner" aria-label="Banner principal">
      <div className="banner__overlay" />
      <div className="banner__content">
        <h1 className="banner__title">¡Leños Rellenos al instante!</h1>
        <p className="banner__subtitle">
          Clásicos desde $40.00 y Especiales irresistibles
        </p>
        <Link
          to="/menu"
          className="bg-white text-amber-700 font-semibold px-6 py-2 rounded hover:bg-gray-200 inline-block"
        >
          Ordena Ahora
        </Link>
      </div>
    </section>
  );
};

export default Banner;
