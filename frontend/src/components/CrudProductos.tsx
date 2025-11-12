import React, { useState, useEffect } from "react";
import AlertaStock from "./AlertaStock"; // 👈 Importación añadida

const CrudProductos = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);

  useEffect(() => {
    // Simula fetch de productos
    setProductos([
      { id: 1, nombre: "Mouse", precio: 25, stock: 3, estado: 1 },
      { id: 2, nombre: "Teclado", precio: 40, stock: 10, estado: 1 },
      { id: 3, nombre: "Monitor", precio: 200, stock: 4, estado: 1 },
    ]);
  }, []);

  const handleEditNombre = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando({ ...editando, nombre: e.target.value });

  const handleEditPrecio = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando({ ...editando, precio: Number(e.target.value) });

  const handleEditStock = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditando({ ...editando, stock: Number(e.target.value) });

  return (
    <div style={{ padding: "20px" }}>
      <h2>CRUD de Productos</h2>
      <table
        className="tabla-productos"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #000",
        }}
      >
        <thead>
          <tr>
            <th></th> {/* para el ícono */}
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
            productos.map((p) => {
              const isInactive = Number(p.estado) === 0;

              return (
                <AlertaStock key={p.id} stock={p.stock}>
                  <>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {p.id}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {editando?.id === p.id ? (
                        <input
                          type="text"
                          value={editando.nombre}
                          onChange={handleEditNombre}
                        />
                      ) : (
                        p.nombre
                      )}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {editando?.id === p.id ? (
                        <input
                          type="number"
                          value={editando.precio}
                          onChange={handleEditPrecio}
                        />
                      ) : (
                        p.precio.toFixed(2)
                      )}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        color: p.stock <= 5 ? "#c0392b" : "#000",
                        fontWeight: p.stock <= 5 ? "bold" : "normal",
                      }}
                    >
                      {editando?.id === p.id ? (
                        <input
                          type="number"
                          value={editando.stock}
                          onChange={handleEditStock}
                        />
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {isInactive ? "Inactivo" : "Activo"}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      <button>Editar</button>
                    </td>
                  </>
                </AlertaStock>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "10px" }}>
                No hay productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CrudProductos;
