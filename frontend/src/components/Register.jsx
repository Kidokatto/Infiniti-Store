import { useState } from "react";
import { registerUser } from "../services/auth";
import logo from "../assets/logo.png";
import "../Register.css";

function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    phone_number: "", // <-- NUEVO
    profile_picture: null,
    cover_photo: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("city", form.city);
    formData.append("phone_number", form.phone_number); // <-- NUEVO

    if (form.profile_picture)
      formData.append("profile_picture", form.profile_picture);
    if (form.cover_photo) formData.append("cover_photo", form.cover_photo);

    try {
      await registerUser(formData);
      setMessage("Registro exitoso! Ahora puedes iniciar sesión.");
      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
      }
    } catch (err) {
      setMessage(
        "Error: " + (err.response?.data?.detail || "Error desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-auth-form">
      <div className="register-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Registro</h2>

          <div className="register-form-group">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Usuario"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ciudad"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="Número de celular"
              required
            />
          </div>
          <div className="register-form-group">
            <input
              id="image-upload"
              className="input-file"
              name="profile_picture"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="image-upload">Selecciona Foto de Perfil</label>
          </div>
          <div className="register-form-group">
            <input
              id="image-upload"
              className="input-file"
              name="cover_photo"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="image-upload">Selecciona Foto de Portada</label>
          </div>
          <button className="buttonregister" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {message && (
          <p
            className={
              message.includes("Error") ? "error-message" : "success-message"
            }
          >
            {message}
          </p>
        )}
      </div>
      <div className="register-image-login-container">
        <img className="register-image-login" src={logo} alt="logo" />
      </div>
    </div>
  );
}

export default Register;
