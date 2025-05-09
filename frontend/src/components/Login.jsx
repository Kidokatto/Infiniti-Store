import { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para redirigir

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
<<<<<<< Updated upstream
  const navigate = useNavigate(); // Hook de navegación
=======
  const [loading, setLoading] = useState(false);
>>>>>>> Stashed changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
<<<<<<< Updated upstream
      setMessage("Login exitoso. Token: " + res.access_token);

      // Si el login es exitoso, marcamos al usuario como autenticado y redirigimos
      navigate("/Perfil"); // Redirige al perfil después de iniciar sesión
=======
      localStorage.setItem('token', res.access_token);
      setMessage("Login exitoso!");
      if (onLoginSuccess) {
        onLoginSuccess();
      }
>>>>>>> Stashed changes
    } catch (err) {
      setMessage("Error de login: " + (err.response?.data?.detail || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Iniciar Sesión</h2>
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
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
    </div>
  );
}

export default Login;