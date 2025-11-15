import React, { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  precio_compra: number;
  stock: number;
  estado?: number | string;
  descripcion?: string | null;
  id_categoria: number | null;
  id_proveedor: number | null;
}

export default function CrudProductos() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<Producto | null>(null);

  // Buscar productos por similitud
  const buscarProductos = async () => {
  const action = busqueda.trim() ? "search" : undefined;

  try {
    // Construir la cadena de consulta si hay búsqueda
    const queryString = action
      ? `?action=search&query=${encodeURIComponent(busqueda.trim())}`
      : "";

    // Realizar la solicitud con fetch hacia la ruta correcta
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/productos/obtenerProductos${queryString}`
    );

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();

    // Validar y extraer los productos del backend
    const productosRaw = Array.isArray(data?.productos) ? data.productos : [];

    // Normalizar los datos recibidos
    const productosNormalizados: Producto[] = productosRaw.map((p: any) => ({
      id: Number(p.id),
      nombre: p.nombre ?? "",
      precio: Number(p.precio) || 0,
      precio_compra: Number(p.precio_compra) || Number(p.precio) || 0,
      stock: Number(p.stock) || 0,
      estado:
        p.estado === undefined || p.estado === null ? 1 : Number(p.estado),
      descripcion: p.descripcion ?? null,
      id_categoria: p.id_categoria != null ? Number(p.id_categoria) : null,
      id_proveedor: p.id_proveedor != null ? Number(p.id_proveedor) : null,
    }));

    // Actualizar estado
    setProductos(productosNormalizados);
    setMensaje(
      productosNormalizados.length ? "" : "No se encontraron coincidencias"
    );
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
    if (editando.id_categoria == null || editando.id_categoria <= 0) {
      setMensaje("ID de categoría debe ser un número positivo");
      return;
    }
     if (editando.id_proveedor == null || editando.id_proveedor <= 0) {
      setMensaje("ID de proveedor debe ser un número positivo");
      return;
    }

    try {
      // Evitar llamada si no hay cambios respecto al producto original
      const original = productos.find((p) => p.id === editando.id);
      if (original) {
        const orig = {
          nombre: (original.nombre ?? "").toString().trim(),
          precio_venta: Number(original.precio),
          precio_compra: Number(original.precio_compra),
          stock: Number(original.stock),
          descripcion: original.descripcion ?? "",
          id_categoria: Number(original.id_categoria),
          id_proveedor: Number(original.id_proveedor),
        };

        const edited = {
          nombre: String(editando.nombre).trim(),
          precio_venta: Number(editando.precio),
          precio_compra: Number(editando.precio_compra),
          stock: Number(editando.stock),
          descripcion: editando.descripcion ? String(editando.descripcion) : "",
          id_categoria: Number(editando.id_categoria),
          id_proveedor: Number(editando.id_proveedor),
        };

        const noChanges =
          orig.nombre === edited.nombre &&
          orig.precio_venta === edited.precio_venta &&
          orig.precio_compra === edited.precio_compra &&
          orig.stock === edited.stock &&
          (orig.descripcion ?? "") === (edited.descripcion ?? "") &&
          orig.id_categoria === edited.id_categoria &&
          orig.id_proveedor === edited.id_proveedor;

        if (noChanges) {
          setMensaje("No hay cambios para guardar");
          return;
        }
      }
  // Validar datos antes de enviar
      const payload = {
        id: Number(editando.id),
        nombre: String(editando.nombre).trim(),
        precio_venta: Number(editando.precio),
        precio_compra: Number(editando.precio_compra),
        stock: Number(editando.stock),
        descripcion: editando.descripcion ? String(editando.descripcion) : "",
        id_categoria: Number(editando.id_categoria),
        id_proveedor: Number(editando.id_proveedor),
      };

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/productos/actualizarProducto`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Producto actualizado correctamente");
      setEditando(null);
      buscarProductos();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar el producto");
    }

  };

  // Handlers tipados para inputs
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBusqueda(e.target.value);

  const handleEditNombre = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando((prev) =>
      prev ? { ...prev, nombre: e.target.value } : prev
    );

  const handleEditPrecio = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando((prev) =>
      prev ? { ...prev, precio: parseFloat(e.target.value) || 0 } : prev
    );

  const handleEditStock = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando((prev) =>
      prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : prev
    );

  const handleEditCategoria = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando((prev) =>
      prev ? { ...prev, id_categoria: parseInt(e.target.value) || null } : prev
    );

  const handleEditProveedor = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando((prev) =>
      prev ? { ...prev, id_proveedor: parseInt(e.target.value) || null } : prev
    );

  // Cambiar estado del producto a inactivo
  const desactivarProducto = async (id: number) => {
    if (!confirm("¿Deseas marcar este producto como inactivo?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/productos/desactivarProducto`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!res.ok) {
        throw new Error(`Error del servidor (${res.status})`);
      }

      const data = await res.json();

      setMensaje(data.message || "Producto marcado como inactivo");
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
          onChange={handleBusquedaChange}
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

      <p
        className="status"
        style={{ textAlign: "center", fontStyle: "italic", color: "#555" }}
      >
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
          <tr
            style={{
              background: "#000",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            <th style={{ padding: "10px", border: "1px solid #000" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Nombre</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Precio Venta</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Precio Compra</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Stock</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Categoria</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Proveedor</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Descripción</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Estado</th>
            <th style={{ padding: "10px", border: "1px solid #000" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((p) => {
              const isInactive = Number(p.estado) === 0;
              return (
                <tr
                  key={p.id}
                  style={{
                    opacity: isInactive ? 0.6 : 1,
                    textDecoration: isInactive ? "line-through" : "none",
                  }}
                >
                  <td style={{ padding: "10px", border: "1px solid #000" }}>{p.id}</td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {editando?.id === p.id ? (
                      <input
                        type="text"
                        value={editando.nombre}
                        onChange={handleEditNombre}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "100%",
                        }}
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
                        step="0.01"
                        min={0}
                        onChange={handleEditPrecio}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      p.precio.toFixed(2)
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {editando?.id === p.id ? (
                      <input
                        type="number"
                        value={editando.precio_compra}
                        step="0.01"
                        min={0}
                        onChange={(e) =>
                          setEditando((prev) =>
                            prev ? { ...prev, precio_compra: parseFloat(e.target.value) || 0 } : prev
                          )
                        }
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      p.precio_compra.toFixed(2)
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
                        step={1}
                        min={0}
                        onChange={handleEditStock}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "60px",
                        }}
                      />
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {editando?.id === p.id ? (
                      <input
                        type="number"
                        value={editando.id_categoria ?? ""}
                        min={0}
                        step={1}
                        onChange={handleEditCategoria}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "60px",
                        }}
                      />
                    ) : (
                      p.id_categoria
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {editando?.id === p.id ? (
                      <input
                        type="number"
                        value={editando.id_proveedor ?? ""}
                        min={0}
                        step={1}
                        onChange={handleEditProveedor}
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "60px",
                        }}
                      />
                    ) : (
                      p.id_proveedor
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {editando?.id === p.id ? (
                      <input
                        type="text"
                        value={editando.descripcion || ""}
                        onChange={(e) =>
                          setEditando((prev) =>
                            prev ? { ...prev, descripcion: e.target.value } : prev
                          )
                        }
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          width: "100%",
                        }}
                      />
                    ) : (
                      p.descripcion || ""
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {isInactive ? "Inactivo" : "Activo"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {!isInactive && (
                      <>
                        {editando?.id === p.id ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
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
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
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
              );
            })
          ) : (
            <tr>
              <td
                colSpan={10}
                style={{
                  textAlign: "center",
                  color: "#999",
                  padding: "12px",
                }}
              >
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}