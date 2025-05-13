import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/product";
import ProductItem from "./ProductItem";
import ProductFilters from "./ProductFilters";
import { FiShoppingBag, FiUser, FiPlus } from "react-icons/fi";
import ProductForm from "./ProductForm";
function Dashboard() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: null,
    category: null,
    brand: null,
    min_price: null,
    max_price: null,
    in_stock: false,
  });

  const fetchProducts = async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.min_price) params.min_price = parseFloat(filters.min_price);
      if (filters.max_price) params.max_price = parseFloat(filters.max_price);
      if (filters.in_stock) params.in_stock = filters.in_stock;

      const response = await getProducts(params);
      setProducts(response.products);
      setTotalPages(response.pages);
      setPage(response.page);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los productos: " +
          (err.response?.data?.detail || err.message)
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-layout">
        <aside className="marketplace-sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar en Infinite Store"
              value={filters.search || ""}
              onChange={(e) =>
                handleFilterChange({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div className="sidebar-nav">
            <button
              className="nav-item active"
              onClick={() => setShowForm(!showForm)}
            >
              <FiPlus style={{ marginRight: "5px" }} />
              {showForm ? "Cerrar formulario" : "Agregar producto"}
            </button>

            {showForm && (
              <div className="product-form-container">
                <ProductForm />
              </div>
            )}
          </div>

          <div className="sidebar-nav">
            <button className="nav-item active">
              <FiShoppingBag /> Explorar todo
            </button>
          </div>

          <div className="filters-section">
            <h3>Categorías</h3>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="marketplace-main">
          <div className="section-header">
            <h2>Sugerencias de hoy</h2>
          </div>

          {loading && <div className="loading">Cargando productos...</div>}

          {error && <div className="error">{error}</div>}

          {!loading && !error && products.length === 0 && (
            <div className="no-results">No se encontraron productos</div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>

              <div className="pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </button>

                <span>
                  Página {page} de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
