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