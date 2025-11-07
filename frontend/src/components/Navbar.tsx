import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ background: "#023e8a", color: "white", padding: "1rem" }}>
      <span style={{ fontWeight: "bold" }}>🧾 Sistema de Ventas</span>
      {user && (
        <span style={{ float: "right", cursor: "pointer" }} onClick={logout}>
          Cerrar sesión ({user.nombre_usuario})
        </span>
      )}
    </nav>
  );
}

export default Navbar;