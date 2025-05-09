import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProductDetail from "./components/ProductDetail";
import './Dashboard.css';
import './ProductFilters.css';
import './ProductDetail.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-tabs">
          <button 
            className={activeTab === 'login' ? 'active' : ''} 
            onClick={() => setActiveTab('login')}
          >
            Iniciar Sesión
          </button>
          <button 
            className={activeTab === 'register' ? 'active' : ''} 
            onClick={() => setActiveTab('register')}
          >
            Registrarse
          </button>
        </div>
        
        {activeTab === 'login' ? 
          <Login onLoginSuccess={handleLogin} /> : 
          <Register onRegisterSuccess={() => setActiveTab('login')} />
        }
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;