import React, { useEffect, useState } from "react";
import { getProveedores, deleteProveedor } from "../../services/proveedoresService";

export const ProveedoresList: React.FC = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);

  const cargarProveedores = async () => {
    const data = await getProveedores();
    setProveedores(data);
  };

  const eliminarProveedor = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este proveedor?")) {
      await deleteProveedor(id);
      cargarProveedores();
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  return (
    <div>
      <h2>Lista de Proveedores</h2>
      <table border={1} cellPadding={5}>
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
          {proveedores.map((prov) => (
            <tr key={prov.id_proveedor}>
              <td>{prov.id_proveedor}</td>
              <td>{prov.nombre}</td>
              <td>{prov.ruc}</td>
              <td>{prov.telefono}</td>
              <td>{prov.correo}</td>
              <td>{prov.producto_principal}</td>
              <td>
                <button onClick={() => eliminarProveedor(prov.id_proveedor)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
