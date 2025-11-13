import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "../Navbar";
import "../../styles/admin.css";
import "../../styles/registrarVenta.css";
import type {
  Categoria,
  ProductoBackend,
  ProductoVenta,
} from "../../types/RegistrarVenta";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Obtener la URL base desde variables de entorno
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

function RegistrarVenta() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);
  const [productosDisponibles, setProductosDisponibles] = useState<
    ProductoBackend[]
  >([]);
  const [carrito, setCarrito] = useState<ProductoVenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoCliente, setTipoCliente] = useState<"ALUMNO" | "DOCENTE" | "OTRO">(
    "ALUMNO"
  );
  const [metodoPago, setMetodoPago] = useState<
    "EFECTIVO" | "YAPE" | "PLIN" | "OTROS"
  >("EFECTIVO");

  // Datos de ejemplo para caja (se cambiarán después)
  // EN ESPERA DE INTEGRAR CON EL MODELO DE CAJA
  const cajaEjemplo = {
    id_caja: 2,
    ubicacion: "Caja Principal",
    isOpen: true,
  };


  
  useEffect(() => {
    const cargarCategorias = async () => {
      setLoadingCategorias(true);
      try {

        const res= await fetch(`${BASE_URL}/api/categorias/`,{
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Error al cargar categorías');


        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoadingCategorias(false);
      }
    };

    cargarCategorias();
  }, []);

  // Calcular el total del carrito
  const calcularTotal = (): number => {
    return carrito.reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };

  // Cargar productos por categoría
  const cargarProductosPorCategoria = async (idCategoria: number) => {
    setLoading(true);
    setError(null);
    setCategoriaSeleccionada(idCategoria);

    try {
      const res= await fetch(`${BASE_URL}/api/productos/obtenerProductosPorCategoria/${idCategoria}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Error al cargar productos');
      
      setProductosDisponibles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar productos");
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto: ProductoBackend) => {
    const productoExistente = carrito.find((p) => p.id === producto.id);

    if (productoExistente) {
      // Si ya existe, incrementar cantidad
      if (productoExistente.cantidad < producto.stock) {
        setCarrito(
          carrito.map((p) =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
          )
        );
      } else {
        alert(
          `No hay suficiente stock disponible. Stock actual: ${producto.stock}`
        );
      }
    } else {
      // Si no existe, agregarlo con cantidad 1
      if (producto.stock > 0) {
        const nuevoProducto: ProductoVenta = {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          stock: producto.stock,
        };
        setCarrito([...carrito, nuevoProducto]);
      } else {
        alert("Este producto no tiene stock disponible");
      }
    }
  };

  // Incrementar cantidad de producto en carrito
  const incrementarCantidad = (idProducto: number) => {
    setCarrito(
      carrito.map((p) => {
        if (p.id === idProducto) {
          if (p.cantidad < p.stock) {
            return { ...p, cantidad: p.cantidad + 1 };
          } else {
            alert(
              `No hay suficiente stock disponible. Stock actual: ${p.stock}`
            );
            return p;
          }
        }
        return p;
      })
    );
  };

  // Disminuir cantidad de producto en carrito
  const disminuirCantidad = (idProducto: number) => {
    setCarrito(
      carrito.map((p) =>
        p.id === idProducto && p.cantidad > 1
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (idProducto: number) => {
    setCarrito(carrito.filter((p) => p.id !== idProducto));
  };

  // Aceptar venta
  const handleAceptar = async () => {
    if (carrito.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    try {
      // Preparar datos según el formato esperado por la API
      const ventaData = {
        id_usuario: user?.id_usuario || user?.id,
        id_caja: cajaEjemplo.id_caja,
        tipo_cliente: tipoCliente,
        metodo_pago: metodoPago,
        estado_venta: "COMPLETADA",
        productos: carrito.map((producto) => ({
          id_producto: producto.id,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio,
        })),
      };

      console.log("Enviando datos de venta:", ventaData);

      const res = await fetch(`${BASE_URL}/api/ventas/registrar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });

      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Error al registrar venta');
      console.log("Respuesta del servidor:", data);

      alert(
        `Venta registrada exitosamente. ID Venta: ${data.data.id_venta}, Total: S/. ${data.data.total}`
      );

      // Limpiar carrito después de venta exitosa
      setCarrito([]);
      setProductosDisponibles([]);
      setCategoriaSeleccionada(null);
    } catch (error: any) {
      console.error("Error al registrar venta:", error);
      alert(
        `Error al registrar venta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Cancelar venta
  const handleCancelar = () => {
    if (carrito.length === 0) {
      alert("El carrito ya está vacío");
      return;
    }

    const confirmar = window.confirm(
      "¿Estás seguro de que deseas cancelar la venta? Se perderán todos los productos seleccionados."
    );
    if (confirmar) {
      setCarrito([]);
      alert("Venta cancelada. El carrito ha sido vaciado.");
    }
  };

  // Guardar en pendiente
  const handleGuardarPendiente = async () => {
    if (carrito.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    try {
      // Preparar datos según el formato esperado por la API
      const ventaData = {
        id_usuario: user?.id_usuario || user?.id,
        id_caja: cajaEjemplo.id_caja,
        tipo_cliente: tipoCliente,
        metodo_pago: metodoPago,
        estado_venta: "PENDIENTE",
        productos: carrito.map((producto) => ({
          id_producto: producto.id,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio,
        })),
      };

      console.log("Guardando venta pendiente:", ventaData);

      const res= await fetch(`${BASE_URL}/api/ventas/registrar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Error al registrar venta');
      console.log("Respuesta del servidor:", data);
      
      alert(
        `Venta guardada como pendiente. ID Venta: ${data.data.id_venta}`
      );

      // Limpiar carrito después de guardar
      setCarrito([]);
      setProductosDisponibles([]);
      setCategoriaSeleccionada(null);
    } catch (error: any) {
      console.error("Error al guardar venta pendiente:", error);
      alert(
        `Error al guardar venta pendiente: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Verificar autenticación
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-container">
      <Navbar />

      <div className="registrar-venta-container">
        <div className="venta-content">
          {/* Sección izquierda: Categorías y Productos */}
          <div className="venta-left">
            {/* Sección de Categorías */}
            <div className="categorias-section">
              <h2 className="section-title">Categoría de productos</h2>
              {loadingCategorias ? (
                <p className="loading-text">Cargando categorías...</p>
              ) : (
                <div className="categorias-grid">
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id_categoria}
                      className={`categoria-btn ${
                        categoriaSeleccionada === categoria.id_categoria
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        cargarProductosPorCategoria(categoria.id_categoria)
                      }
                    >
                      {categoria.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sección de Productos Disponibles */}
            <div className="productos-section">
              <h2 className="section-title">Productos disponibles</h2>
              {loading && <p className="loading-text">Cargando productos...</p>}
              {error && <p className="error-text">{error}</p>}
              {!loading && !error && productosDisponibles.length === 0 && (
                <p className="empty-text">
                  Selecciona una categoría para ver los productos
                </p>
              )}
              <div className="productos-grid">
                {productosDisponibles.map((producto) => (
                  <div key={producto.id} className="producto-card">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-precio">
                      S/. {producto.precio.toFixed(2)}
                    </p>
                    <p className="producto-stock">Stock: {producto.stock}</p>
                    {producto.descripcion && (
                      <p className="producto-descripcion">
                        {producto.descripcion}
                      </p>
                    )}
                    <button
                      className="btn-agregar-producto"
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.stock === 0}
                    >
                      <ShoppingCartIcon className="icon" />
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sección derecha: Registrar Venta */}
          <div className="venta-right">
            {/* Header con información de usuario y caja */}
            <div className="venta-header">
              <div className="info-item">
                <span className="info-label">Caja:</span>
                <span className="info-value">{cajaEjemplo.ubicacion}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Usuario:</span>
                <span className="info-value">
                  {user?.nombre_usuario || user?.nombre || "Usuario"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Rol:</span>
                <span className="info-value">
                  {user?.rol_usuario || user?.rol || "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado Caja:</span>
                <span
                  className={`info-value ${
                    cajaEjemplo.isOpen ? "caja-abierta" : "caja-cerrada"
                  }`}
                >
                  {cajaEjemplo.isOpen ? "Abierta" : "Cerrada"}
                </span>
              </div>
            </div>

            <div className="registrar-venta-card">
              <h2 className="section-title">Registrar Venta</h2>

              {/* Selectores de tipo de cliente y método de pago */}
              <div className="venta-selectors">
                <div className="selector-group">
                  <label className="selector-label">Tipo de Cliente:</label>
                  <select
                    className="venta-select"
                    value={tipoCliente}
                    onChange={(e) =>
                      setTipoCliente(
                        e.target.value as "ALUMNO" | "DOCENTE" | "OTRO"
                      )
                    }
                  >
                    <option value="ALUMNO">Alumno</option>
                    <option value="DOCENTE">Docente</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div className="selector-group">
                  <label className="selector-label">Método de Pago:</label>
                  <select
                    className="venta-select"
                    value={metodoPago}
                    onChange={(e) =>
                      setMetodoPago(
                        e.target.value as "EFECTIVO" | "YAPE" | "PLIN" | "OTROS"
                      )
                    }
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="YAPE">Yape</option>
                    <option value="PLIN">Plin</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
              </div>

              <div className="total-section">
                <span className="total-label">TOTAL:</span>
                <span className="total-value">
                  S/. {calcularTotal().toFixed(2)}
                </span>
              </div>

              <div className="carrito-section">
                <h3 className="carrito-title">
                  Listar productos seleccionados
                </h3>

                {carrito.length === 0 ? (
                  <p className="carrito-vacio">
                    No hay productos seleccionados
                  </p>
                ) : (
                  <div className="carrito-lista">
                    {carrito.map((producto) => (
                      <div key={producto.id} className="carrito-item">
                        <div className="carrito-item-info">
                          <span className="carrito-item-nombre">
                            {producto.nombre}
                          </span>
                          <span className="carrito-item-precio">
                            S/. {producto.precio.toFixed(2)} x{" "}
                            {producto.cantidad}
                          </span>
                          <span className="carrito-item-subtotal">
                            = S/.{" "}
                            {(producto.precio * producto.cantidad).toFixed(2)}
                          </span>
                        </div>
                        <div className="carrito-item-actions">
                          <button
                            className="btn-cantidad"
                            onClick={() => disminuirCantidad(producto.id)}
                            disabled={producto.cantidad <= 1}
                          >
                            <MinusIcon className="icon-small" />
                          </button>
                          <span className="cantidad-display">
                            {producto.cantidad}
                          </span>
                          <button
                            className="btn-cantidad"
                            onClick={() => incrementarCantidad(producto.id)}
                            disabled={producto.cantidad >= producto.stock}
                          >
                            <PlusIcon className="icon-small" />
                          </button>
                          <button
                            className="btn-eliminar"
                            onClick={() => eliminarDelCarrito(producto.id)}
                          >
                            <TrashIcon className="icon-small" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="venta-actions">
                <button
                  className="btn-primary btn-aceptar"
                  onClick={handleAceptar}
                  disabled={carrito.length === 0}
                >
                  <CheckIcon className="icon-small" />
                  Aceptar
                </button>
                <button
                  className="btn-secondary btn-cancelar"
                  onClick={handleCancelar}
                >
                  <XMarkIcon className="icon-small" />
                  Cancelar
                </button>
              </div>

              <button
                className="btn-pendiente"
                onClick={handleGuardarPendiente}
                disabled={carrito.length === 0}
              >
                Guardar en pendiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrarVenta;
