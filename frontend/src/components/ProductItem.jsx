import React, { useState, useEffect } from "react";
import axios from "axios";


function ProductItem({ product, onClick, showActions, onDelete, onEdit }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (product.user_id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:8001/auth/user/${product.user_id}`);
          if (response.data && response.data.username) {
            setUsername(response.data.username);
          }
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      };
      fetchUser();
    }
  }, [product.user_id]);


  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="product-card">
      <div onClick={() => onClick(product.id)}>
        <img
          src={
            product.image_url
              ? `http://localhost:8001${product.image_url}`
              : "https://placehold.co/600x400"
          }
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <span className="product-price">${formatPrice(product.price)}</span>
          <h3>{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
          {username && <p className="product-vendor">Vendedor: {username}</p>}
        </div>
      </div>
      {showActions && (
        <div className="product-actions">
          <button onClick={() => onEdit(product.id)} className="edit-button">Editar</button>
          <button onClick={() => onDelete(product.id)} className="delete-button">Eliminar</button>
        </div>
      )}
    </div>
  );
}

export default ProductItem;
