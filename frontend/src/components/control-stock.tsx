import React, { useState, useEffect } from 'react';

interface ProductoStock {
  id: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  precio: number;
}

// Detectar si está en local o en servidor
const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000/api/stock"
  : "http://38.250.161.15/api/stock";

const ControlStock: React.FC = () => {
  const [productos, setProductos] = useState<ProductoStock[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarStock = async () => {
      try {
        const respuesta = await fetch(API_URL, { credentials: "include" });
        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        console.error("Error al cargar el stock:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarStock();
  }, []);

  if (cargando) return <div>Cargando datos de stock...</div>;

  const esStockBajo = (producto: ProductoStock): boolean =>
    producto.stockActual <= producto.stockMinimo;

  return (
    <div style={{ padding: '20px' }}>
      <h1>📦 Control de Stock</h1>
      <p>Vista general del inventario de productos conectado al backend.</p>

      {productos.some(esStockBajo) && (
        <div style={styles.alertaGeneral}>
          ⚠️ <strong>¡ATENCIÓN!</strong> Hay productos con stock bajo.
        </div>
      )}

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>Stock Actual</th>
            <th style={styles.th}>Stock Mínimo</th>
            <th style={styles.th}>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr
              key={producto.id}
              style={esStockBajo(producto) ? styles.rowBajoStock : {}}
            >
              <td style={styles.td}>{producto.id}</td>
              <td style={styles.td}>{producto.nombre}</td>
              <td
                style={{
                  ...styles.td,
                  fontWeight: esStockBajo(producto) ? 'bold' : 'normal',
                  color: esStockBajo(producto) ? '#d32f2f' : 'inherit'
                }}
              >
                {producto.stockActual}
              </td>
              <td style={styles.td}>{producto.stockMinimo}</td>
              <td style={styles.td}>${producto.precio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  thead: {
    backgroundColor: '#f4f4f4',
  },
  th: {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
  },
  rowBajoStock: {
    backgroundColor: '#fbe9e7',
  },
  alertaGeneral: {
    backgroundColor: '#ffe0b2',
    padding: '10px',
    marginBottom: '20px',
    borderLeft: '5px solid #ff9800',
  }
};

export default ControlStock;
