import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProductDetail from "./components/ProductDetail";
import LayoutNavbar from "./components/LayoutNavbar";
import Profile from "./components/Profile";
import ProductForm from "./components/ProductForm";
import "./Dashboard.css";
import "./ProductFilters.css";
import "./ProductDetail.css";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Verifica si ya hay token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Función que se ejecuta al hacer login exitoso
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Si no está autenticado, muestra login/registro
  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Iniciar Sesión
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? (
          <Login onLoginSuccess={handleLogin} />
        ) : (
          <Register onRegisterSuccess={() => setActiveTab("login")} />
        )}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rutas que incluyen la navbar */}
        <Route element={<LayoutNavbar onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ProductForm" element={<ProductForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Ruta extra por si recarga justo en /login */}
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
