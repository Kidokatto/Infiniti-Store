import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, deleteProduct } from "../services/product";
import { FiArrowLeft, FiShoppingCart, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [isOwner, setIsOwner] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
        
        if (data.user_id) {
          try {
            const userResponse = await axios.get(`http://localhost:8001/auth/user/${data.user_id}`);
            if (userResponse.data && userResponse.data.username) {
              setUsername(userResponse.data.username);
            }
          } catch (userError) {
            console.error("Error al obtener el usuario:", userError);
          }
        }
        
       const token = localStorage.getItem("token");
        if (token) {
          try {
            const currentUserResponse = await axios.get("http://localhost:8001/auth/profile", {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.user_id && currentUserResponse.data.id === data.user_id) {
              setIsOwner(true);
            }
          } catch (err) {
            console.error("Error al obtener perfil:", err);
          }
        }
      } catch (err) {
        setError("Error al cargar el producto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (value) => {
    return value
      .toFixed(0) 
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);
        navigate("/");
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el producto");
      }
    }
  };
  
  const handleEdit = () => {
    navigate(`/edit-product/${id}`);
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">Cargando producto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error">{error || "Producto no encontrado"}</div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Rgresar
      </button>

      <div className="product-detail-content">
        {/* Imagen del producto */}
        <div className="image-wrapper">
          <img
            className="product-image"
            src={
              product.image_url
                ? `http://localhost:8001${product.image_url}`
                : "https://via.placeholder.com/600x600"
            }
            alt={product.name}
          />
        </div>

        {/* Información del producto */}
        <div className="product-detail-info">
          <h1>{product.name}</h1>

          <div className="product-detail-price">
            ${formatPrice(product.price)}
          </div>

          <div className="product-detail-brand">
            <strong>Marca:</strong> {product.brand}
          </div>

          <div className="product-detail-category">
            <strong>Categoría:</strong> {product.category}
          </div>

                {username && (
            <div className="product-detail-vendor">
              <strong>Vendedor:</strong> {username}
            </div>
          )}


          <div className="product-detail-stock">
            <strong>Stock:</strong>{" "}
            <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
              {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
            </span>
          </div>

          <div className="product-detail-description">
            <h3>Descripción</h3>
            <p>{product.description || "Sin descripción disponible"}</p>
          </div>

          <div className="product-detail-actions">
            <button className="buy-button" disabled={product.stock === 0}>
              <FiShoppingCart /> Comprar ahora
            </button>

              {isOwner && (
              <>
                <button className="edit-button" onClick={handleEdit}>
                  <FiEdit /> Editar
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  <FiTrash /> Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
