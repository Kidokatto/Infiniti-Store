import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const LayoutNavbar = () => {
  const location = useLocation();

  // Lista de rutas donde NO quieres mostrar el navbar
  const hiddenRoutes = ["/login"];

  const hideNavbar = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default LayoutNavbar;
