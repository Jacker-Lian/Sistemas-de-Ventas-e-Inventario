import "../components/Proveedor.css";

import React from "react";


interface Proveedor {
  id_proveedor: number;
  nombre: string;
  ruc: string;
  telefono: string;
  correo: string;
  producto_principal: string;
}

const ProveedorList: React.FC<{
  proveedores: Proveedor[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ proveedores, onEdit, onDelete }) => {
  return (
    <div className="list-container">
      <h2>Lista de Proveedores</h2>
      <table className="proveedor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Producto Principal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map((p) => (
              <tr key={p.id_proveedor}>
                <td>{p.id_proveedor}</td>
                <td>{p.nombre}</td>
                <td>{p.ruc}</td>
                <td>{p.telefono}</td>
                <td>{p.correo}</td>
                <td>{p.producto_principal}</td>
                <td>
                  <button className="btn-edit" onClick={() => onEdit(p.id_proveedor)}>Editar</button>
                  <button className="btn-delete" onClick={() => onDelete(p.id_proveedor)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={7}>No hay proveedores registrados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedorList;
