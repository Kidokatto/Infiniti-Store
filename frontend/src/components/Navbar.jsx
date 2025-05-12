import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);

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
  }, []); // Solo una vez al montar

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div>
      {" "}
      <header className="marketplace-header">
        <div className="header-content">
          <h1>Marketplace</h1>
          <h2>Perfil</h2>
          <p>
            <strong>Nombre de usuario:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
