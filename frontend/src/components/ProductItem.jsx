import React from "react";

function ProductItem({ product, onClick }) {
  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="product-card" onClick={() => onClick(product.id)}>
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
      </div>
    </div>
  );
}

export default ProductItem;
