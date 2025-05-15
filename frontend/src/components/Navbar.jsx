import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo2 from "../assets/logo2.png";
import "../Navbar.css"; // Asegúrate de tener este archivo CSS
function Navbar({ onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:8001/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error(
            "Error al obtener el perfil:",
            err.response?.data || err.message
          );
          setUser(null);
        });
    }
  }, []);

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout(); // Informa al App que cierre sesión
  };

  return (
    <div>
      <header className="navbar-header">
        <div className="navbar-container">
          <div className="navbar-left" onClick={() => navigate("/")}>
            <img className="header-logo" src={logo2} alt="logo" />
            <h1 className="store-title">Infinite Store</h1>
          </div>
          <div className="navbar-right">
            <button onClick={handleGoToProfile}>Ver Perfil</button>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
