import React, { useState, useEffect } from "react";
import { getCategories, getBrands } from "../services/product";

function ProductFilters({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      onFilterChange({ ...filters, [name]: checked });
    } else {
      // Convertir string vacío a null para evitar errores
      const newValue = value === "" ? null : value;
      onFilterChange({ ...filters, [name]: newValue });
    }
  };

  const handleCategoryClick = (category) => {
    onFilterChange({ ...filters, category: category });
  };

  return (
    <div className="filters-container">
      <div className="category-list">
        <button
          className={`category-item ${!filters.category ? "active" : ""}`}
          onClick={() => handleCategoryClick(null)}
        >
          Todas las categorías
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-item ${
              filters.category === category ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="advanced-filters">
        <h3>Filtros avanzados</h3>

        <div className="filter-group">
          <label>Marca</label>
          <select
            name="brand"
            value={filters.brand || ""}
            onChange={handleFilterChange}
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Rango de precio</label>
          <div className="price-range">
            <input
              type="number"
              name="min_price"
              value={filters.min_price || ""}
              onChange={handleFilterChange}
              placeholder="Mínimo"
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              name="max_price"
              value={filters.max_price || ""}
              onChange={handleFilterChange}
              placeholder="Máximo"
              min="0"
            />
          </div>
        </div>

        <div className="filter-group-checkbox">
          <label>
            <input
              type="checkbox"
              name="in_stock"
              checked={filters.in_stock || false}
              onChange={handleFilterChange}
            />
            Solo productos en stock
          </label>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
