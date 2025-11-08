import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  margin: '0 10px',
  fontWeight: 500
};

const brandStyle = {
  textDecoration: 'none',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

function Navbar() {
  const { user, logout } = useAuth();

  const homePath = user?.rol_usuario === 'ADMIN' ? '/admin' : '/caja';

  return (
    <nav style={{ background: "#023e8a", color: "white", padding: "1rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      <div>
        <Link to={homePath} style={brandStyle}>
          🧾 Sistema de Ventas
        </Link>

        {user && (
          <span style={{ marginLeft: '20px' }}>
            
            <Link to="/caja" style={linkStyle}>
              Caja
            </Link>

            {user.rol_usuario === 'ADMIN' && (
              <Link to="/admin" style={linkStyle}>
                Administración
              </Link>
            )}

          </span>
        )}
      </div>

      <div>
        {user && (
          <span style={{ cursor: "pointer" }} onClick={logout}>
            Cerrar sesión ({user.nombre_usuario})
          </span>
        )}
      </div>
    </nav>
  );
}


export default Navbar;