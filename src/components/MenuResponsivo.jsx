import { navbarLinks } from "../data/data";
import { AnimatePresence, motion } from "framer-motion";

const MenuResponsivo = ({ open, navbarLinks }) => {
  const animacion = {
    initial: { opacity: 0, y: -100 }, //Estado Inicial: opacidad-> 0 = a que sea invisible
    animate: { opacity: 1, y: 0 }, //Estado final: opacidad -> 1 = a que este visible
    exit: { opacity: 0, y: -100 }, //cómo desaparece → vuelve a subir y se hace invisible.
    transition: { duration: 0.3 }, // duración de la animación (0.3 segundos).
  };
  return (
    <AnimatePresence mode="await">
      {open && ( // solo renderiza el menú si open es true
        <motion.div {...animacion} className="absolute top-20 left-0 w-full h-screen z-20">
          <div className="text-xl font-semibold uppercase bg-primary text-white rounded-b-md py-7 m-6">
            <ul className="flex flex-col justify-center items-center gap-10">
              {navbarLinks.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default MenuResponsivo;

