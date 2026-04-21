import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/secciones/Home';
import Menu from "./components/secciones/Menu";
import About from './components/secciones/About';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Login from './components/secciones/Login';
import Carrito from './components/secciones/Carrito';
import MisPedidos from './components/secciones/MisPedidos';
import { CartProvider } from "./context/CartContext";
import AdminPanel from './components/secciones/Admin';
import SeccionComentarios from './components/secciones/Comentarios';

const App = () => {
  return (
    <div className='overflow-x-hidden'>
      <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<><Banner /><Home /></>} /> 
          <Route path="/About" element={<About />}></Route>
          <Route path="/Menu" element={<Menu />}></Route>
          <Route path="/MisPedidos" element={<MisPedidos />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
      <SeccionComentarios />
    </div>
  )
}


export default App
