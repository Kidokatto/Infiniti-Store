import { useState } from "react";
import { registerUser } from "../services/auth";

function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      setMessage("Registro exitoso! Ahora puedes iniciar sesión.");
      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
      }
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.detail || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Usuario"
            required
          />
        </div>
        <div className="form-group">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
    </div>
  );
}

export default Register;