// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";

import { Link } from 'react-router-dom'; 

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    usuarios: 120,
    ventas: 3200,
    visitas: 4578,
    notificaciones: 8,
  });

  
  // Lista de enlaces del menú
  const menuItems = ["Inicio", "Usuarios", "Reportes", "Configuración", "Alerta de Stock" , "Registro de ventas", "Registro y gestión de usuarios", "Gestión de categorías", "Detalle de venta" ,   "Historial de ventas" ,    "Reportes de ventas" ,   "Panel de administrador",  "Gestión de proveedores"];


  const getPath = (item: string): string => {
    if (item === "Inicio") return "/";
    return `/${item.toLowerCase().replace(/\s/g, '')}`;
  };

  return (
    <div className="dashboard-container"> 
      
      {/* Sidebar */}
      <aside className="sidebar"> 
        <h2>Mi Panel</h2>
        {menuItems.map((item) => (
        
          <Link
            key={item}
            to={getPath(item)} 
          >
            {item}
          </Link>
        ))}
      </aside>

     
    
    </div>
  );
};

export default Dashboard;