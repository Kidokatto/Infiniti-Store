import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar"; // Si tienes Navbar
import Perfil from "./components/Perfil";
import LayoutWithNavbar from "./components/LayoutNavbar"; // Componente de layout con Navbar
function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin Navbar */}
        <Route
          path="/"
          element={
            <div>
              <Login />
              <Register />
            </div>
          }
        />

        {/* Rutas con Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/perfil" element={<Perfil />} />
          {/* Aquí puedes agregar más rutas protegidas que incluyan el Navbar */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
