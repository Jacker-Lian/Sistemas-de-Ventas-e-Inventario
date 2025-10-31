// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
import AlertaStock from './components/AlertaStock'; 
import './css/Dashboard.css'; // Importamos el CSS tradicional

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Muestra el Dashboard (con el Sidebar) */}
        <Route path="/" element={<Dashboard />} /> 
        
        {/* Nueva ruta: Muestra SOLO la Alerta de Stock en su propia página */}
        <Route path="/alertastock" element={<AlertaStock />} />
        
        {/* Puedes añadir más rutas aquí: /usuarios, /reportes, etc. */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;