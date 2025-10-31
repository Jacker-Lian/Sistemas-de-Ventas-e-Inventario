// src/components/AlertaStock.tsx
import React from 'react';

const AlertaStock: React.FC = () => {
    // Datos de ejemplo para la alerta
    const itemsBajoStock = [
        { id: 1, nombre: "Café en grano", stock: 5, min: 10 },
        { id: 2, nombre: "Azúcar", stock: 12, min: 20 },
    ];

    return (
 
        <div className="main-content" style={{ padding: '2rem', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                Inventario Crítico: Alerta de Stock
            </h1>
            
            <div className="alerta-stock" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                    🚨 ¡ATENCIÓN! {itemsBajoStock.length} productos están por debajo del stock mínimo.
                </h4>
                
                <ul style={{ listStyleType: 'none' }}>
                    {itemsBajoStock.map(item => (
                        <li key={item.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #fca5a5' }}>
                            <span style={{ fontWeight: 'bold' }}>{item.nombre}:</span> {item.stock} unidades (Mínimo: {item.min}).
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AlertaStock;