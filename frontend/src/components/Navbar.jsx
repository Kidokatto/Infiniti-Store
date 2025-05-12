import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
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

  return (
    <div>
      <header className="marketplace-header">
        <div className="header-content">
          <h1
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/products")}
          >
            Infinite Store
          </h1>
          <button onClick={handleGoToProfile}>Ver Perfil</button>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
