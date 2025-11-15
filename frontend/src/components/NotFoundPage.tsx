import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={{ fontSize: '40px', color: 'navy', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Esta página no existe</p>
      <Link to={"/"}>
        <button style={{ fontSize: '40px', cursor: 'pointer', height: '100px' }}>
          Volver a Inicio
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;