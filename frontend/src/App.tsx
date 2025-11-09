<<<<<<< HEAD
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
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Caja from "./components/Caja";
import AjusteInventario from './components/AjusteInventario/AjusteInventario'; 
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/caja"
            element={
              <PrivateRoute roles={['CAJA', 'ADMIN']}>
                <Caja />
              </PrivateRoute>
            }
          />
          <Route 
            path="/inventario/ajuste" 
            element={
              <PrivateRoute roles={['ADMIN', 'CAJA']}>
                <AjusteInventario />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

>>>>>>> origin/main
