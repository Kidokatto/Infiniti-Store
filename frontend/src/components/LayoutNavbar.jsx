import { Outlet, useLocation } from "react-router-dom"; // ✅ useLocation agregado
import Navbar from "./Navbar";

const LayoutNavbar = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // Oculta navbar solo en /login

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet /> {/* Renderiza la ruta activa */}
    </>
  );
};

export default LayoutNavbar;
