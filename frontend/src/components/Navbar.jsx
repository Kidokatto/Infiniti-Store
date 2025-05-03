import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/perfil">Mi Perfil</Link>
        </li>
        {/* Puedes agregar más enlaces según sea necesario */}
      </ul>
    </nav>
  );
};

export default Navbar;
