import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/product";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
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
      .toFixed(0) // Sin decimales
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
        <FiArrowLeft /> Volver
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
