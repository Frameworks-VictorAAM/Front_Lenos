import React, { useState } from 'react'
import { navbarLinks } from '../data/data'
import { MdMenu } from "react-icons/md";
import { PiShoppingCartLight } from "react-icons/pi";
import MenuResponsivo from "./MenuResponsivo";
import { GiFluffyFlame } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom"; // Añadimos useNavigate

const Navbar = () => {
    const [abierto, setAbierto] = useState(false);
    const navigate = useNavigate();

    // --- LÓGICA DE SESIÓN ---
    const token = localStorage.getItem("x-auth-token");
    const userRole = localStorage.getItem("user-role");

    const cerrarSesion = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <>
            <nav>
                <div className='container flex justify-between font-bold items-center py-8'>
                    {/* Logo */}
                    <Link to="/" className='text-2xl flex items-center gap-2 uppercase'>
                        <GiFluffyFlame />
                        <p>Lenos</p>
                        <p className='text-secondary'> Rellenos</p>
                    </Link>

                    {/* Links de data.js */}
                    <div className="hidden md:block">
                        <ul className="flex items-center gap-7 text-gray-600">
                            {navbarLinks.map((item) => (
                                <li key={item.id}>
                                    <a href={item.url} className="inline-block py-1 px-3 hover:text-primary">
                                        {item.title}
                                    </a>
                                </li>
                            ))}

                            {/* BOTÓN SOLO PARA ADMINS */}
                            {token && userRole === "admin" && (
                                <li>
                                    <Link 
                                        to="/admin" 
                                        className="inline-block py-1 px-3 text-secondary border-b-2 border-secondary hover:text-primary transition"
                                    >
                                        Administracion
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Iconos y Login/Logout */}
                    <div className="flex items-center gap-4">
                        <Link to="/carrito" className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-300">
                            <PiShoppingCartLight />
                        </Link>

                        {token ? (
                            <button 
                                onClick={cerrarSesion}
                                className="hover:bg-red-600 font-semibold rounded-md text-white bg-red-500 px-4 py-2 duration-300 hidden md:block"
                            >
                                Salir
                            </button>
                        ) : (
                            <Link to="/login" className="hover:bg-primary font-semibold rounded-md text-white bg-secondary px-4 py-2 duration-300 border-primary hidden md:block">
                                Ingresar
                            </Link>
                        )}
                    </div>

                    {/* Menú Móvil */}
                    <div className="md:hidden">
                        <MdMenu onClick={() => setAbierto(!abierto)} className="text-4xl" />
                    </div>
                </div>
            </nav>
            
            <MenuResponsivo open={abierto} navbarLinks={navbarLinks} />
        </>
    )
}

export default Navbar