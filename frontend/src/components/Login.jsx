import { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para redirigir

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook de navegación

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      setMessage("Login exitoso. Token: " + res.access_token);

      // Si el login es exitoso, marcamos al usuario como autenticado y redirigimos
      navigate("/Perfil"); // Redirige al perfil después de iniciar sesión
    } catch (err) {
      setMessage("Error de login: " + err.response?.data?.detail);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <br />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
