import { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/Caja.css';


interface Producto {
  id_producto: number;
  nombre: string;
  precio_unitario: number; 
  stock: number;
}

interface CarritoItem extends Producto {
  cantidad: number;
}

interface DetalleBoleta {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface BoletaCompleta {
  id_venta: number;
  fecha_venta: string;
  tipo_cliente: string;
  metodo_pago: string;
  total: number;
  detalles: DetalleBoleta[];
}

// --- Constantes para los botones ---

const TIPOS_CLIENTE = ['ALUMNO', 'DOCENTE', 'OTRO'];
const METODOS_PAGO = ['EFECTIVO', 'YAPE', 'PLIN', 'OTROS'];

function Caja() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [tipoCliente, setTipoCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('');

  const [ventaCompletada, setVentaCompletada] = useState<BoletaCompleta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {

        const res = await api.get('../productos'); 
        setProductos(res.data.data || res.data); 
      } catch (err) {
        setError('Error al cargar productos. ¿El endpoint /api/productos existe?');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto: Producto) => {
    if (carrito.find(item => item.id_producto === producto.id_producto)) return;
    
    if (producto.stock <= 0) {
      alert('No hay stock de este producto');
      return;
    }
    
    setCarrito(prev => [...prev, { ...producto, cantidad: 1 }]);
  };

  const actualizarCantidad = (id_producto: number, cantidad: number) => {
    const productoStock = productos.find(p => p.id_producto === id_producto);
    
    if (cantidad <= 0) {
      setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
      return;
    }
    
    if (productoStock && cantidad > productoStock.stock) {
      alert(`Stock máximo: ${productoStock.stock}`);
      cantidad = productoStock.stock;
    }

    setCarrito(prev => 
      prev.map(item => 
        item.id_producto === id_producto ? { ...item, cantidad } : item
      )
    );
  };
  
  const quitarDelCarrito = (id_producto: number) => {
     setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
  };

  const totalCarrito = useMemo(() => {
    return carrito.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
  }, [carrito]);

  const handleRegistrarVenta = async () => {
    
    if (carrito.length === 0) return setError('El carrito está vacío');
    if (!tipoCliente) return setError('Seleccione un tipo de cliente');
    if (!metodoPago) return setError('Seleccione un método de pago');
    if (!user) return setError('Error de autenticación, recargue la página');

    setLoading(true);
    setError('');

    const payload = {
      id_usuario: user!.id_usuario,
      id_caja: 1, 
      id_sucursal: 1, 
      tipo_cliente: tipoCliente,
      metodo_pago: metodoPago,
      estado_venta: "COMPLETADA",
      productos: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      }))
    };

    try {
      const resPost = await api.post('../ventas/registrar', payload);
      const { id_venta } = resPost.data.data;

      const resGet = await api.get(`../historial-ventas/${id_venta}`);
      
      setVentaCompletada(resGet.data.data);
      setCarrito([]);
      setTipoCliente('');
      setMetodoPago('');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error desconocido al registrar la venta');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNuevaVenta = () => {
    setVentaCompletada(null);
 
  };

  return (
    <>
      <Navbar />
      
      {!ventaCompletada && (
        <div className="caja-container">
          <div className="product-list-wrapper">
            <h3>Productos Disponibles</h3>
            {loading && <p>Cargando productos...</p>}
            <div className="product-list">
              {productos.map(p => (
                <div 
                  key={p.id_producto} 
                  className={`product-card ${p.stock <= 0 ? 'disabled' : ''}`}
                  onClick={() => p.stock > 0 && agregarAlCarrito(p)}
                >
                  <span className="product-name">{p.nombre}</span>
                  <span className="product-price">S/ {p.precio_unitario.toFixed(2)}</span>
                  <span className="product-stock">Stock: {p.stock}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sale-details">
            <h2>Carrito de Venta</h2>
            <div className="carrito-list">
              {carrito.length === 0 ? (
                <p>Agrega productos desde la lista...</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id_producto} className="carrito-item">
                    <span>{item.nombre}</span>
                    <input 
                      type="number" 
                      min="0"
                      max={item.stock}
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item.id_producto, parseInt(e.target.value))}
                    />
                    <span>S/ {(item.cantidad * item.precio_unitario).toFixed(2)}</span>
                    <button onClick={() => quitarDelCarrito(item.id_producto)}>&times;</button>
                  </div>
                ))
              )}
            </div>

            <h3 className="carrito-total">Total: S/ {totalCarrito.toFixed(2)}</h3>

            <div className="sale-options">
              <div className="option-group">
                <h4>Tipo de Cliente</h4>
                {TIPOS_CLIENTE.map(tipo => (
                  <button 
                    key={tipo} 
                    className={`btn-option ${tipoCliente === tipo ? 'selected' : ''}`}
                    onClick={() => setTipoCliente(tipo)}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
              
              <div className="option-group">
                <h4>Método de Pago</h4>
                {METODOS_PAGO.map(metodo => (
                  <button 
                    key={metodo} 
                    className={`btn-option ${metodoPago === metodo ? 'selected' : ''}`}
                    onClick={() => setMetodoPago(metodo)}
                  >
                    {metodo}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <button 
              className="btn-registrar-venta" 
              onClick={handleRegistrarVenta}
              disabled={loading || carrito.length === 0 || !tipoCliente || !metodoPago}
            >
              {loading ? 'Registrando...' : 'Registrar Venta'}
            </button>
          </div>
        </div>
      )}

      {ventaCompletada && (
        <div className="boleta-modal-backdrop">
          <div className="boleta-modal-content">
            <h3>Venta Registrada (Boleta)</h3>
            <p><strong>N° Venta:</strong> {ventaCompletada.id_venta}</p>
            <p><strong>Fecha:</strong> {new Date(ventaCompletada.fecha_venta).toLocaleString()}</p>
            <p><strong>Cliente:</strong> {ventaCompletada.tipo_cliente}</p>
            <p><strong>Pago:</strong> {ventaCompletada.metodo_pago}</p>
            
            <table className="boleta-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>P. Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ventaCompletada.detalles.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombre_producto}</td>
                    <td>{item.cantidad}</td>
                    <td>S/ {Number(item.precio_unitario).toFixed(2)}</td>
                    <td>S/ {Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h2 className="boleta-total">
              TOTAL: S/ {Number(ventaCompletada.total).toFixed(2)}
            </h2>
            
            <button className="btn-nueva-venta" onClick={handleNuevaVenta}>
              Nueva Venta
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Caja;
