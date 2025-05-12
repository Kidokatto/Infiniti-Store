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
        {/* Usar la ruta correcta para la foto de portada */}
        <img
          src={
            user.cover_photo
              ? `http://localhost:8001/static/${user.cover_photo}` // Ruta corregida
              : "/assets/yo.jpg"
          }
          alt="Fondo de la carta"
          className="fondoCarta"
        />

        {/* Usar la ruta correcta para la foto de perfil */}
        <img
          src={
            user.profile_picture
              ? `http://localhost:8001/static/${user.profile_picture}` // Ruta corregida
              : "/assets/yo.jpg"
          }
          alt="Foto de perfil"
          className="fotoPerfil"
        />

        <p>{user.username}</p>
        <p>{user.email}</p>

        <section className="info">
          <div>Ciudad: {user.city}</div>
          <div>Enviar mensaje</div>
        </section>
      </section>
    </div>
  );
};

export default Profile;
