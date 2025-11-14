import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Caja from "./components/Caja";
import AjusteInventario from "./components/AjusteInventario/AjusteInventario";
import RegistrarVenta from "./components/RegistroVentas/RegistrarVenta"; 
import PrivateRoute from "./components/PrivateRoute";
import CrudCategorias from "./components/CategoriaTable";
import HistorialVentas from "./components/HistorialVentas/HistorialVentas";
import ReporteVentas from './components/ReporteVentas/ReporteVentas';
import Sucursales from "./components/Sucursales";
import { Login, Admin, Caja, AjusteInventario, PrivateRoute, 
  CrudCategorias, RegistrarVenta, HistorialVentas, ReporteVentas, Gastos  } from './components';


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
          <Route 
            path="/admin/Sucursales" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <Sucursales />
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
            path="/gastos"
            element={
              <PrivateRoute roles={['ADMIN', 'CAJA']}>
                <Gastos />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
