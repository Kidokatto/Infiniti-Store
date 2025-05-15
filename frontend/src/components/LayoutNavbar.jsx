import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const LayoutNavbar = ({ onLogout }) => {
  const location = useLocation();

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
