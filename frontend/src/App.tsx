import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Caja from "./components/Caja";
import AjusteInventario from './components/AjusteInventario/AjusteInventario';
import AjusteInventario from "./components/AjusteInventario/AjusteInventario";
import RegistrarVenta from "./components/RegistroVentas/RegistrarVenta"; 
import PrivateRoute from "./components/PrivateRoute";
import ControlStock from './components/control-stock';
import CrudCategorias from "./components/CategoriaTable";
import HistorialVentas from "./components/HistorialVentas/HistorialVentas";
import ReporteVentas from './components/ReporteVentas/ReporteVentas';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/caja"
            element={
              <PrivateRoute roles={["CAJA", "ADMIN"]}>
                <Caja />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventario/ajuste"
            element={
              <PrivateRoute roles={["ADMIN", "CAJA"]}>
                <AjusteInventario />
              </PrivateRoute>
            }
          />


          <Route
            path="/admin/control-stock" // Debe coincidir con el 'to' de tu botón
            element={
              <PrivateRoute roles={['ADMIN']}>
                <ControlStock /> {/* <-- Usa el componente importado */}
          <Route
            path="/registrarVenta"
            element={
              <PrivateRoute roles={["CAJA", "ADMIN"]}>
                <RegistrarVenta />
              </PrivateRoute>
            }
          />
          <Route 
            path="/categorias" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <CrudCategorias />
              </PrivateRoute>
            } 
          />
          <Route
            path="/ventas/historial"
            element={
              <PrivateRoute roles={["ADMIN", "CAJA"]}>
                <HistorialVentas />
              </PrivateRoute>
            }
          />
          <Route 
            path="/inventario/ReporteVentas" 
            element={
              <PrivateRoute roles={['ADMIN', 'CAJA']}>
                <ReporteVentas />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
