import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Caja from "./components/Caja";
import AjusteInventario from './components/AjusteInventario/AjusteInventario'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/caja" element={<Caja />} />
          <Route path="/inventario/ajuste" element={<AjusteInventario />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

