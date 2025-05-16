import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Profile.css";
import ProductItem from "./ProductItem";

import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../services/product";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8001/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);

          return axios.get(
            `http://localhost:8001/products/user/${res.data.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
        .then((productsRes) => {
          setUserProducts(productsRes.data.products);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err.response?.data || err.message);
          setError("Error al cargar los datos");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No hay sesión activa");
    }
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await deleteProduct(productId);
        setUserProducts(
          userProducts.filter((product) => product.id !== productId)
        );
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el producto");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-text">No se encontró información del usuario</div>
      </div>
    );
  }

  return (
    <div className="container profile-container">
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
        <p>Correo: {user.email}</p>
        <p>Num Cel: {user.phone_number}</p>

        <section className="info">
          <div>Ciudad: {user.city}</div>
          <div>Enviar mensaje</div>
        </section>
      </section>

      <section className="user-products">
        <h2>Mis Productos</h2>

        {userProducts.length === 0 ? (
          <p>No has publicado ningún producto todavía.</p>
        ) : (
          <div className="products-grid">
            {userProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onClick={handleProductClick}
                showActions={true}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
