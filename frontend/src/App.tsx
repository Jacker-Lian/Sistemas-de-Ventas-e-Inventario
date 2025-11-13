import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Login, Admin, Caja, AjusteInventario, PrivateRoute, 
  CrudCategorias, HistorialVentas, ReporteVentas, Gastos  } from './components';

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
              <PrivateRoute roles={['ADMIN', 'CAJA']}>
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

