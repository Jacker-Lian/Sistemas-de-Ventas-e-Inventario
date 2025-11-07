import Navbar from "./Navbar";

function Admin() {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Bienvenido al Panel de Administración</h2>
        <p>Aquí puedes gestionar usuarios, productos y ventas.</p>
      </div>
    </>
  );
}
export default Admin;
