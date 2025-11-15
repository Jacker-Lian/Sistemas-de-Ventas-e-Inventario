import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AjusteInventario.css';
import { type Producto, type AjusteFormData } from '../../types/ajusteInventario';
const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const AjusteInventario: React.FC = () => {
    // --- ESTADOS ---
    const [productos, setProductos] = useState<Producto[]>([]);
    const { user } = useAuth();
    const [formData, setFormData] = useState<AjusteFormData>({
        id_producto: '',
        cantidad_ajustada: 0,
        tipo_ajuste: 'DISMINUCION',
        id_usuario: user?.id_usuario || '',
        observaciones: ''
    });
        // Actualizar id_usuario en formData si cambia el usuario autenticado
        useEffect(() => {
            setFormData((prev) => ({ ...prev, id_usuario: user?.id_usuario || '' }));
        }, [user]);
    const [stockActual, setStockActual] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' | '' }>({ texto: '', tipo: '' });

    // --- EFECTO: Cargar Productos ---
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Backend expone /api/productos/obtenerProductos que retorna { productos: [...], usuario: {...} }
                const response = await fetch(`${API_URL}/api/productos/obtenerProductos`);
                if (!response.ok) throw new Error('No se pudo cargar la lista de productos.');
                const data = await response.json();
                const listaBackend = Array.isArray(data) ? data : (Array.isArray(data.productos) ? data.productos : []);
                // Adaptar campos (backend usa id en lugar de id_producto)
                const adaptados: Producto[] = listaBackend.map((p: any) => ({
                    id_producto: p.id !== undefined ? p.id : p.id_producto,
                    nombre: p.nombre,
                    stock: p.stock ?? 0
                }));
                setProductos(adaptados);
            } catch (error: any) {
                console.error("Error al cargar productos:", error);
                setMensaje({ texto: `Error al cargar los productos: ${error.message}`, tipo: 'error' });
            }
        };
        fetchProductos();
    }, []);

    // --- MANEJADORES DE CAMBIO ---
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: AjusteFormData) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        setFormData((prev: AjusteFormData) => ({ ...prev, id_producto: id }));
        const selectedProduct = productos.find((p: Producto) => p.id_producto === id);
        setStockActual(selectedProduct ? selectedProduct.stock : null);
    };

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cantidad = parseFloat(e.target.value);
        const cantidadEntera = Math.trunc(cantidad); 
        setFormData((prev: AjusteFormData) => ({ 
            ...prev, 
            cantidad_ajustada: isNaN(cantidadEntera) ? 0 : cantidadEntera,
            tipo_ajuste: cantidadEntera >= 0 ? 'AUMENTO' : 'DISMINUCION' 
        }));
    };

    // --- FUNCIÓN DE ENVÍO ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        const { id_producto, cantidad_ajustada, observaciones, id_usuario, tipo_ajuste } = formData;

        if (!id_producto || cantidad_ajustada === 0 || !observaciones || !id_usuario) {
            setMensaje({ texto: 'Por favor, complete todos los campos y la cantidad debe ser diferente de 0.', tipo: 'error' });
            return;
        }

        try {
            // Endpoint correcto según backend: /api/ajustes-inventario (POST)
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`${API_URL}/api/ajustes-inventario`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    id_producto,
                    cantidad_ajustada,
                    tipo_ajuste,
                    id_usuario,
                    observaciones,
                    id_sucursal: 1 // TODO: reemplazar por sucursal dinámica
                })
            });

            const result = await response.json();

            if (!response.ok) {
                // Maneja errores de validación del backend
                throw new Error(result.error || `Error ${response.status}: ${response.statusText}`);
            }
            
            setMensaje({ texto: '✅ Ajuste de inventario realizado con éxito!', tipo: 'success' });
            
            // Recargar productos para reflejar el nuevo stock sin recargar toda la página
            const updatedProductsResponse = await fetch(`${API_URL}/api/productos/obtenerProductos`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            if (updatedProductsResponse.ok) {
                const dataUpdated = await updatedProductsResponse.json();
                const listaBackend = Array.isArray(dataUpdated) ? dataUpdated : (Array.isArray(dataUpdated.productos) ? dataUpdated.productos : []);
                const adaptados: Producto[] = listaBackend.map((p: any) => ({
                    id_producto: p.id !== undefined ? p.id : p.id_producto,
                    nombre: p.nombre,
                    stock: p.stock ?? 0
                }));
                setProductos(adaptados);
            }

            // Limpiar formulario
            setFormData((prev: AjusteFormData) => ({ 
                ...prev, 
                id_producto: '', 
                cantidad_ajustada: 0, 
                observaciones: '' 
            }));
            setStockActual(null);

        } catch (error: any) {
            console.error("Error en la solicitud POST:", error);
            setMensaje({ texto: `❌ Fallo al registrar el ajuste: ${error.message}`, tipo: 'error' });
        }
    };

    // --- RENDERIZADO ---
    return (
        <div className="container-ajuste">
            <h2>⚙️ Ajuste Manual de Inventario</h2>
            
            {mensaje.texto && (
                <div className={`alerta ${mensaje.tipo === 'error' ? 'alerta-error' : 'alerta-exito'}`}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                
                {/* 1. Selección de Producto */}
                <div className="form-group">
                    <label htmlFor="id_producto">Producto a Ajustar:</label>
                    <select 
                        name="id_producto" 
                        value={formData.id_producto} 
                        onChange={handleProductChange}
                        required
                    >
                        <option value="">-- Seleccione un producto --</option>
                        {productos.map((p: Producto) => (
                            <option key={p.id_producto} value={p.id_producto}>
                                {p.nombre} (Stock: {p.stock})
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* 2. Stock Actual */}
                {stockActual !== null && (
                    <p className="stock-info">
                        **Stock Actual:** {stockActual} unidades.
                    </p>
                )}

                {/* 3. Cantidad a Ajustar */}
                <div className="form-group">
                    <label htmlFor="cantidad_ajustada">Cantidad de Ajuste:</label>
                    <p className="nota-ayuda">
                        Ingrese **números enteros**. Positivo para **AUMENTO**, negativo para **DISMINUCION**.
                    </p>
                    <input 
                        type="number" 
                        name="cantidad_ajustada" 
                        value={formData.cantidad_ajustada} 
                        onChange={handleCantidadChange} 
                        placeholder="Ej: 5 o -3"
                        required 
                        step="1"
                    />
                </div>
                
                {/* 4. Observaciones / Motivo */}
                <div className="form-group">
                    <label htmlFor="observaciones">Observaciones / Motivo:</label>
                    <textarea 
                        name="observaciones" 
                        value={formData.observaciones} 
                        onChange={handleChange}
                        placeholder="Motivo exacto del ajuste (ej: Pérdida por rotura, Error de conteo)"
                        maxLength={255}
                        required
                    />
                </div>
                
                {/* ID de Usuario (Oculto) */}
                <input type="hidden" name="id_usuario" value={formData.id_usuario} />

                <button type="submit" className="btn-guardar">
                    Registrar Ajuste
                </button>
            </form>
            {/* Tabla de Productos con Alertas de Stock */}
            <div style={{ marginTop: "40px" }}>
                <h3>Estado de Stock de Productos</h3>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                    border: "1px solid #000",
                }}>
                    <thead>
                        <tr style={{
                            background: "#000",
                            color: "#fff",
                            textTransform: "uppercase",
                        }}>
                            <th style={{ padding: "10px", border: "1px solid #000", width: "40px" }}></th>
                            <th style={{ padding: "10px", border: "1px solid #000" }}>ID</th>
                            <th style={{ padding: "10px", border: "1px solid #000" }}>Nombre</th>
                            <th style={{ padding: "10px", border: "1px solid #000" }}>Stock Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map((p) => (
                                <AlertaStock stock={p.stock} key={p.id_producto}>
                                    <td style={{ padding: "10px", border: "1px solid #000" }}>{p.id_producto}</td>
                                    <td style={{ padding: "10px", border: "1px solid #000" }}>{p.nombre}</td>
                                    <td style={{
                                        padding: "10px",
                                        border: "1px solid #000",
                                        color: p.stock <= 5 ? "#c0392b" : "#000",
                                        fontWeight: p.stock <= 5 ? "bold" : "normal",
                                    }}>
                                        {p.stock}
                                    </td>
                                </AlertaStock>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{
                                    textAlign: "center",
                                    color: "#999",
                                    padding: "12px",
                                }}>
                                    Sin productos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AjusteInventario;