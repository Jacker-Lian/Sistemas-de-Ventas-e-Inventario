import React, { useState } from "react";
import ProveedorForm from "./components/ProveedorForm";
import ProveedorList from "./pages/ProveedorList";

const App: React.FC = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);

  const addProveedor = (nuevo: any) => {
    const nuevoProveedor = { id_proveedor: Date.now(), ...nuevo };
    setProveedores([...proveedores, nuevoProveedor]);
  };

  const editProveedor = (id: number) => {
    alert(`Editar proveedor con ID: ${id}`);
  };

  const deleteProveedor = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este proveedor?")) {
      setProveedores(proveedores.filter((p) => p.id_proveedor !== id));
    }
  };

  return (
    <>
      <ProveedorForm onAdd={addProveedor} />
      <ProveedorList proveedores={proveedores} onEdit={editProveedor} onDelete={deleteProveedor} />
    </>
  );
};

export default App;
