import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/product";
import ProductForm from "./ProductForm";
import { FiArrowLeft } from "react-icons/fi";

function EditProduct() {
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
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el producto para editar");
        console.error(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSuccess = () => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (error || !product) {
    return <div className="error">{error || "No se pudo cargar el producto"}</div>;
  }

  return (
    <div className="edit-product-page">
        <button className="back-button" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Volver
        </button>
      <ProductForm productToEdit={product} onSuccess={handleSuccess} />
    </div>
  );
}

export default EditProduct;