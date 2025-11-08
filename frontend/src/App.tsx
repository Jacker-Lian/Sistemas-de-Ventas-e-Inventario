import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Caja from "./components/Caja";
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

