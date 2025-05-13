import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const LayoutNavbar = ({ onLogout }) => {
  const location = useLocation();

  // Lista de rutas donde NO quieres mostrar el navbar
  const hiddenRoutes = ["/login"];

  const hideNavbar = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar onLogout={onLogout} />}
      <Outlet />
    </>
  );
};

export default LayoutNavbar;
