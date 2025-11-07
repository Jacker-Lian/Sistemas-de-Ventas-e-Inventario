import { useState, useEffect } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

const baseApi = import.meta.env.VITE_API_URL;

export default function CrudProductos() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<Producto | null>(null);
  const [nuevo, setNuevo] = useState<Producto>({ id: 0, nombre: "", precio: 0, stock: 0 });

  // 🔍 Buscar productos por similitud
  const buscarProductos = async () => {
    if (!busqueda.trim()) {
      setMensaje("Escriba un nombre para buscar productos");
      return;
    }
    try {
      const res = await fetch(`${baseApi}?action=search&query=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
      setMensaje(data.length ? "" : "No se encontraron coincidencias");
    } catch (err) {
      console.error(err);
      setMensaje("Error al buscar productos");
    }
  };

  // 💾 Guardar nuevo o actualizado
  const guardarProducto = async () => {
    const producto = editando || nuevo;
    if (!producto.nombre.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio_venta", producto.precio.toString());
    formData.append("stock", producto.stock.toString());
    if (editando) formData.append("id", producto.id.toString());

    try {
      const action = editando ? "update" : "create";
      const res = await fetch(`${baseApi}?action=${action}`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setMensaje(result.message || "Guardado correctamente");
      setEditando(null);
      setNuevo({ id: 0, nombre: "", precio: 0, stock: 0 });
      buscarProductos();
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar");
    }
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const formData = new FormData();
    formData.append("id", id.toString());
    try {
      const res = await fetch(`${baseApi}?action=delete`, { method: "POST", body: formData });
      const result = await res.json();
      setMensaje(result.message || "Eliminado correctamente");
      buscarProductos();
    } catch (err) {
      console.error(err);
      setMensaje("Error al eliminar");
    }
  };

  const limpiarCampos = () => {
    setEditando(null);
    setNuevo({ id: 0, nombre: "", precio: 0, stock: 0 });
    setMensaje("");
  };

  return (
    <div className="crud-container">
      <h1>CRUD de Productos</h1>
      <p>Busca, edita, crea o elimina productos — estilo blanco y negro.</p>

      {/* 🔍 Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button onClick={buscarProductos}>Buscar</button>
      </div>

      <p className="status">{mensaje}</p>

      {/* 📋 Tabla de resultados */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.precio.toFixed(2)}</td>
                <td
                  style={{
                    color: p.stock <= 5 ? "#c0392b" : "black",
                    fontWeight: p.stock <= 5 ? "bold" : "normal",
                  }}
                >
                  {p.stock}
                </td>
                <td>
                  <button onClick={() => setEditando(p)}>Editar</button>
                  <button className="danger" onClick={() => eliminarProducto(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Sin resultados</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✏️ Formulario Crear/Editar */}
      <div className="formulario">
        <h2>{editando ? "Editar Producto" : "Nuevo Producto"}</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={editando ? editando.nombre : nuevo.nombre}
          onChange={(e) =>
            editando
              ? setEditando({ ...editando, nombre: e.target.value })
              : setNuevo({ ...nuevo, nombre: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Precio"
          value={editando ? editando.precio : nuevo.precio}
          onChange={(e) =>
            editando
              ? setEditando({ ...editando, precio: parseFloat(e.target.value) || 0 })
              : setNuevo({ ...nuevo, precio: parseFloat(e.target.value) || 0 })
          }
        />
        <input
          type="number"
          placeholder="Stock"
          value={editando ? editando.stock : nuevo.stock}
          onChange={(e) =>
            editando
              ? setEditando({ ...editando, stock: parseInt(e.target.value) || 0 })
              : setNuevo({ ...nuevo, stock: parseInt(e.target.value) || 0 })
          }
        />
        <div className="form-buttons">
          <button onClick={guardarProducto}>{editando ? "Actualizar" : "Guardar"}</button>
          <button onClick={limpiarCampos}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
