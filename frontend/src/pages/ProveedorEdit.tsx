import "../components/Proveedor.css";   // ✅ Estilos agregados

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createProveedor, getProveedor, updateProveedor } from '../api/proveedorApi';
import ProveedorForm from '../components/ProveedorForm';

export default function ProveedorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proveedor, setProveedor] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getProveedor(Number(id)).then(res => setProveedor(res.data));
    }
  }, [id]);

  const handleSubmit = (data: any) => {
    if (id) {
      updateProveedor(Number(id), data).then(() => navigate('/'));
    } else {
      createProveedor(data).then(() => navigate('/'));
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
      <ProveedorForm initialData={proveedor} onSubmit={handleSubmit} />
    </div>
  );
}
