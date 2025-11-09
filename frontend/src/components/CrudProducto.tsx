import { useState } from "react";
import api from "../api/axios";

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
      const res = await api.post(
        "/productos",
        {
          id: editando.id,
          nombre: editando.nombre,
          precio_venta: editando.precio,
          stock: editando.stock,
        },
        { params: { action: "update" } }
      );
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
