import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Caja from "./components/Caja";
import AjusteInventario from './components/AjusteInventario/AjusteInventario'; 
import PrivateRoute from "./components/PrivateRoute";
import RegistrarVenta from "./components/RegistroVentas/RegistrarVenta";

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
            path="/registrarVenta"
            element={
              <PrivateRoute roles={['CAJA', 'ADMIN']}>
                <RegistrarVenta />
              </PrivateRoute>
            }
          />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

