import { useState } from "react";
import api from "../api/axios"; // importa tu configuración base

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  estado?: string;
}

export default function CrudProductos() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<Producto | null>(null);

  // Buscar productos por similitud
  const buscarProductos = async () => {
    if (!busqueda.trim()) {
      setMensaje("Escriba un nombre para buscar productos");
      return;
    }
    try {
      const res = await api.get("/productos", {
        params: { action: "search", query: busqueda.trim() },
      });
      setProductos(Array.isArray(res.data) ? res.data : []);
      setMensaje(res.data.length ? "" : "No se encontraron coincidencias");
    } catch (err) {
      console.error(err);
      setMensaje("Error al buscar productos");
    }
  };

  // Guardar cambios de edición
  const guardarCambios = async () => {
    if (!editando) return;
    if (!editando.nombre.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }

    try {
      const res = await api.post("/productos", {
        id: editando.id,
        nombre: editando.nombre,
        precio_venta: editando.precio,
        stock: editando.stock,
      }, { params: { action: "update" } });

      setMensaje(res.data.message || "Producto actualizado correctamente");
      setEditando(null);
      buscarProductos();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar el producto");
    }
  };

  // Cambiar estado del producto a inactivo
  const desactivarProducto = async (id: number) => {
    if (!confirm("¿Deseas marcar este producto como inactivo?")) return;

    try {
      const res = await api.post("/productos", { id }, { params: { action: "deactivate" } });
      setMensaje(res.data.message || "Producto marcado como inactivo");
      buscarProductos();
    } catch (err) {
      console.error(err);
      setMensaje("Error al cambiar el estado del producto");
    }
  };

  return (
    <div className="crud-container" style={{ color: "#000", backgroundColor: "#fff" }}>
      <h1>Gestión de Productos</h1>
      <p>Busca, edita o marca productos como inactivos — estilo blanco y negro.</p>

      {/* Barra de búsqueda */}
      <div className="search-bar" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, padding: "8px", border: "2px solid #000" }}
        />
        <button
          onClick={buscarProductos}
          style={{ background: "#000", color: "#fff", border: "2px solid #000", padding: "8px 16px" }}
        >
          Buscar
        </button>
      </div>

      <p className="status" style={{ textAlign: "center", color: "#555" }}>{mensaje}</p>

      {/* Tabla de resultados */}
      <table
        className="tabla-productos"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "2px solid #000",
          marginBottom: "24px",
        }}
      >
        <thead>
          <tr style={{ background: "#000", color: "#fff" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
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
                <td>{p.id}</td>
                <td>
                  {editando?.id === p.id ? (
                    <input
                      type="text"
                      value={editando.nombre}
                      onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                      style={{ border: "1px solid #000", padding: "4px" }}
                    />
                  ) : (
                    p.nombre
                  )}
                </td>
                <td>
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
                <td>{p.estado === "inactivo" ? "Inactivo" : "Activo"}</td>
                <td>
                  {p.estado !== "inactivo" && (
                    <>
                      {editando?.id === p.id ? (
                        <>
                          <button
                            onClick={guardarCambios}
                            style={{
                              background: "#000",
                              color: "#fff",
                              border: "2px solid #000",
                              padding: "4px 8px",
                              marginRight: "6px",
                              cursor: "pointer",
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            style={{
                              background: "#fff",
                              color: "#000",
                              border: "2px solid #000",
                              padding: "4px 8px",
                              cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditando(p)}
                            style={{
                              border: "2px solid #000",
                              background: "transparent",
                              padding: "4px 8px",
                              marginRight: "6px",
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
                              padding: "4px 8px",
                              cursor: "pointer",
                            }}
                          >
                            Inactivar
                          </button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#999" }}>
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

