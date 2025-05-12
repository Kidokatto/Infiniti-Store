import { useEffect, useState } from "react";
import axios from "axios";
import "../Profile.css"; // Asegúrate de que la ruta sea correcta
const Profile = () => {
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
    <div className="container">
      <section className="carta">
        <img
          src="/assets/yo.jpg"
          alt="Fondo de la carta"
          className="fondoCarta"
        />

        <img
          src="AQUI LA IMAGEN DE PERFIL"
          alt="Foto de perfil"
          className="fotoPerfil"
        />

        <p>{user.username}</p>
        <p>{user.email}</p>

        <section className="info">
          <div>Ciudad</div>
          <div>Enviar mensaje</div>
        </section>
      </section>
    </div>
  );
};

export default Profile;
