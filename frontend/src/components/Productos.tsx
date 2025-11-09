import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { obtenerProductos, crearProducto, actualizarProducto, desactivarProducto } from '../api/productos';
import { Producto, ProductoFormData, ProductoUpdateData } from '../types/productos';
import '../styles/admin.css'; // Reutilizar estilos de admin

function Productos() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    precio_venta: 0,
    precio_compra: 0,
    stock: 0,
    descripcion: '',
    id_categoria: 0,
    id_proveedor: 0,
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.rol_usuario && String(user.rol_usuario).toUpperCase() !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data.productos || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProductos();
      return;
    }
    try {
      const data = await obtenerProductos(searchQuery);
      setProductos(data.productos || []);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProducto) {
        await actualizarProducto({ ...formData, id: editingProducto.id });
      } else {
        await crearProducto(formData);
      }
      setShowForm(false);
      setEditingProducto(null);
      resetForm();
      loadProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      nombre: producto.nombre,
      precio_venta: producto.precio,
      precio_compra: 0, // No disponible en la respuesta, ajustar según necesidad
      stock: producto.stock,
      descripcion: producto.descripcion || '',
      id_categoria: 0, // No disponible, ajustar
      id_proveedor: 0, // No disponible, ajustar
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas desactivar este producto?')) {
      try {
        await desactivarProducto(id);
        loadProductos();
      } catch (error) {
        console.error('Error al desactivar producto:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio_venta: 0,
      precio_compra: 0,
      stock: 0,
      descripcion: '',
      id_categoria: 0,
      id_proveedor: 0,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProducto(null);
    resetForm();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="admin-page">
          <div className="admin-header">
            <h1>Cargando productos...</h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1 className="title">Gestión de Productos</h1>
            <p className="lead muted">Administra el inventario de productos.</p>
          </div>
        </div>

        <section className="admin-grid">
          <div className="search-section">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-primary">Buscar</button>
            <button onClick={() => setShowForm(true)} className="btn btn-secondary">Agregar Producto</button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="product-form">
              <h3>{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio de Venta:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_venta}
                  onChange={(e) => setFormData({ ...formData, precio_venta: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio de Compra:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_compra}
                  onChange={(e) => setFormData({ ...formData, precio_compra: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>ID Categoría:</label>
                <input
                  type="number"
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>ID Proveedor:</label>
                <input
                  type="number"
                  value={formData.id_proveedor}
                  onChange={(e) => setFormData({ ...formData, id_proveedor: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingProducto ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="products-list">
            {productos.map((producto) => (
              <div key={producto.id} className="product-card">
                <h4>{producto.nombre}</h4>
                <p>Precio: ${producto.precio}</p>
                <p>Stock: {producto.stock}</p>
                <p>{producto.descripcion}</p>
                <div className="product-actions">
                  <button onClick={() => handleEdit(producto)} className="btn btn-primary">Editar</button>
                  <button onClick={() => handleDelete(producto.id)} className="btn btn-danger">Desactivar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Productos;

  return (
    <div
      className="crud-container"
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        border: "2px solid #000",
        borderRadius: "10px",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "10px",
        }}
      >
        CRUD de Productos
      </h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Busca, edita o marca productos como inactivos — estilo blanco y negro.
      </p>

      {/* Barra de búsqueda */}
      <div
        className="search-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "60%",
            padding: "8px",
            border: "2px solid #000",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={buscarProductos}
          style={{
            padding: "8px 16px",
            border: "2px solid #000",
            background: "#000",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Buscar
        </button>
      </div>

      <p className="status" style={{ textAlign: "center", fontStyle: "italic", color: "#555" }}>
        {mensaje}
      </p>

      {/* Tabla de resultados */}
      <table
        className="tabla-productos"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          border: "1px solid #000",
        }}
      >
        <thead>
          <tr style={{ background: "#000", color: "#fff", textTransform: "uppercase" }}>
            <th style={{ padding: "10px", border: "1px solid #000" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Nombre</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Precio</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Stock</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Estado</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((p) => (
              <tr
                key={p.id}
                style={{
                  opacity: p.estado === "inactivo" ? 0.6 : 1,
                  textDecoration: p.estado === "inactivo" ? "line-through" : "none",
                }}
              >
                <td style={{ padding: "10px", border: "1px solid #000" }}>{p.id}</td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {editando?.id === p.id ? (
                    <input
                      type="text"
                      value={editando.nombre}
                      onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                      style={{ border: "1px solid #000", padding: "4px", width: "100%" }}
                    />
                  ) : (
                    p.nombre
                  )}
                </td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {editando?.id === p.id ? (
                    <input
                      type="number"
                      value={editando.precio}
                      onChange={(e) =>
                        setEditando({ ...editando, precio: parseFloat(e.target.value) || 0 })
                      }
                      style={{ border: "1px solid #000", padding: "4px", width: "80px" }}
                    />
                  ) : (
                    p.precio.toFixed(2)
                  )}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #000",
                    color: p.stock <= 5 ? "#c0392b" : "#000",
                    fontWeight: p.stock <= 5 ? "bold" : "normal",
                  }}
                >
                  {editando?.id === p.id ? (
                    <input
                      type="number"
                      value={editando.stock}
                      onChange={(e) =>
                        setEditando({ ...editando, stock: parseInt(e.target.value) || 0 })
                      }
                      style={{ border: "1px solid #000", padding: "4px", width: "60px" }}
                    />
                  ) : (
                    p.stock
                  )}
                </td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {p.estado === "inactivo" ? "Inactivo" : "Activo"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {p.estado !== "inactivo" && (
                    <>
                      {editando?.id === p.id ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button
                            onClick={guardarCambios}
                            style={{
                              border: "2px solid #000",
                              background: "#000",
                              color: "#fff",
                              fontWeight: "bold",
                              padding: "6px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            style={{
                              border: "2px solid #000",
                              background: "#fff",
                              color: "#000",
                              fontWeight: "bold",
                              padding: "6px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button
                            onClick={() => setEditando(p)}
                            style={{
                              border: "2px solid #000",
                              background: "transparent",
                              color: "#000",
                              fontWeight: "bold",
                              padding: "6px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => desactivarProducto(p.id)}
                            style={{
                              border: "2px solid #000",
                              background: "#fff",
                              color: "#000",
                              fontWeight: "bold",
                              padding: "6px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Inactivar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#999", padding: "12px" }}>
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
