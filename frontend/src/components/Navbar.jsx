import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      <header className="marketplace-header">
        <div className="header-content">
          <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Infinite Store
          </h1>
          <button onClick={handleGoToProfile}>Ver Perfil</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
