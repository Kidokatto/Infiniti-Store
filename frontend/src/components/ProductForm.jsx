import React, { useState } from "react";
import axios from "axios";
import "../ProductForm.css";

const ProductForm = ({ onSuccess, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setIsEditing(true);
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: formatPrice(productToEdit.price.toString()),
        stock: productToEdit.stock.toString(),
        category: productToEdit.category,
        brand: productToEdit.brand || "",
      });
    }
  }, [productToEdit]);

  const formatPrice = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "price") {
      formattedValue = formatPrice(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      const cleanValue = key === "price" ? value.replace(/\./g, "") : value;
      form.append(key, cleanValue);
    });

    if (image) {
      form.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Debes iniciar sesión para agregar un producto");
        return;
      }

     if (isEditing) {
        await axios.put(`http://localhost:8001/products/${productToEdit.id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        setMessage("Producto actualizado exitosamente");
      } else {
        await axios.post("http://localhost:8001/products/", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
        setMessage("Producto agregado exitosamente");
      }
      setError(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
      });
      setImage(null);

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      setError("Error al agregar el producto");
      setMessage(null);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{isEditing ? "Editar Producto" : "Agregar Producto"}</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={formData.brand}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required={!isEditing}
        />
         <button type="submit">
          {isEditing ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
