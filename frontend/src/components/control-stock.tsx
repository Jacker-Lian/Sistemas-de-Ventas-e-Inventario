import React, { useState, useEffect } from 'react';

// 1. DEFINICIÓN DE INTERFAZ ADAPTADA a la respuesta del Backend
interface ResumenStock {
  productos_en_stock: number;
  productos_vendidos: number;
  total_productos: number;
}

// Valor inicial para el estado del resumen
const INITIAL_RESUMEN: ResumenStock = {
  productos_en_stock: 0,
  productos_vendidos: 0,
  total_productos: 0,
};

// 2. ENDPOINT CORREGIDO
// La ruta que devuelve tu resumen de stock es: /api/stock/resumen-inventario
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api/stock/resumen-inventario";


const ControlStock: React.FC = () => {
  // 3. ESTADO ADAPTADO: Usamos la interfaz de ResumenStock
  const [resumen, setResumen] = useState<ResumenStock>(INITIAL_RESUMEN);
  const [cargando, setCargando] = useState<boolean>(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  useEffect(() => {
    const cargarStock = async () => {
      try {
        const respuesta = await fetch(API_URL, { credentials: "include" });
        
        if (!respuesta.ok) {
            throw new Error(`Error en la red: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();

        // 4. MANEJO DE LA RESPUESTA
        // El backend devuelve { success: true, data: resumen }
        if (datos.success && datos.data) {
            setResumen(datos.data);
        } else {
            // Maneja caso donde la respuesta es OK, pero success: false
            throw new Error(datos.mensaje || "Respuesta de API inesperada");
        }

      } catch (error) {
        console.error("Error al cargar el stock:", error);
        // Mostrar error en la UI
        setErrorCarga("Fallo al conectar o recibir datos del servidor.");
      } finally {
        setCargando(false);
      }
    };

    cargarStock();
  }, []);

  if (cargando) return <div style={styles.contenedor}>Cargando datos de stock...</div>;
  if (errorCarga) return <div style={{...styles.contenedor, color: 'red'}}>🚨 Error: {errorCarga}</div>;
  
  // 5. RENDERIZADO ADAPTADO: Mostrando el resumen
  return (
    <div style={styles.contenedor}>
      <h1> Resumen de Inventario</h1>
      <p>Vista rápida del inventario.</p>

      <div style={styles.cardContainer}>
          <Card title="Productos en Stock" value={resumen.productos_en_stock} color="#4CAF50" />
          <Card title="Productos Vendidos" value={resumen.productos_vendidos} color="#2196F3" />
          <Card title="Total de Productos" value={resumen.total_productos} color="#FF9800" />
      </div>

    </div>
  );
};

// Componente simple para mostrar las métricas
interface CardProps {
    title: string;
    value: number;
    color: string;
}

const Card: React.FC<CardProps> = ({ title, value, color }) => (
    <div style={{ ...styles.card, borderLeftColor: color }}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardValue}>{value.toLocaleString()}</p>
    </div>
);


// 6. ESTILOS ADAPTADOS
const styles: { [key: string]: React.CSSProperties } = {
  contenedor: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '30px',
  },
  card: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderLeft: '5px solid',
  },
  cardTitle: {
    fontSize: '1em',
    color: '#555',
    margin: '0 0 10px 0',
  },
  cardValue: {
    fontSize: '2em',
    fontWeight: 'bold',
    margin: 0,
  }
};

export default ControlStock;