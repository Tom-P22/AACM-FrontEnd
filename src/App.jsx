import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";
import Perfil from "./pages/Perfil";
import MisReservas from "./pages/MisReservas";
import NotFound from "./pages/NotFound";
import { ReservationProvider } from "./context/ReservationContext";
import { ContentProvider } from "./context/ContentContext";

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <CartProvider>
          <ReservationProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/mis-reservas" element={<MisReservas />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </BrowserRouter>
          </ReservationProvider>
        </CartProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
