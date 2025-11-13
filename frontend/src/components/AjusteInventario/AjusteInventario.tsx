import React, { useState, useEffect } from 'react';
import './AjusteInventario.css'; // Asegúrate de que esta ruta sea correcta para tu CSS
import AlertaStock from '../AlertasInventario';
import { type Producto, type AjusteFormData } from '../../types/ajusteInventario';
// URL de tu Backend (Node.js)
const API_URL = 'http://localhost:3000/api'; 

const AjusteInventario: React.FC = () => {
    // --- ESTADOS ---
    const [productos, setProductos] = useState<Producto[]>([]);
    const [formData, setFormData] = useState<AjusteFormData>({
        id_producto: '',
        cantidad_ajustada: 0,
        tipo_ajuste: 'DISMINUCION',
        id_usuario: 1, // **IMPORTANTE: Debe ser dinámico (ID del usuario logueado)**
        observaciones: ''
    });
    const [stockActual, setStockActual] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' | '' }>({ texto: '', tipo: '' });

    // --- EFECTO: Cargar Productos ---
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Llama al GET /api/productos
                const response = await fetch(`${API_URL}/productos`);
                if (!response.ok) throw new Error('No se pudo cargar la lista de productos.');
                const data: Producto[] = await response.json();
                setProductos(data);
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        setFormData(prev => ({ ...prev, id_producto: id }));
        
        // Muestra el stock del producto seleccionado
        const selectedProduct = productos.find(p => p.id_producto === id);
        setStockActual(selectedProduct ? selectedProduct.stock : null);
    };

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cantidad = parseFloat(e.target.value);
        // Usamos Math.trunc para asegurar que la cantidad sea un entero (inventario)
        const cantidadEntera = Math.trunc(cantidad); 
        
        setFormData(prev => ({ 
            ...prev, 
            cantidad_ajustada: isNaN(cantidadEntera) ? 0 : cantidadEntera,
            // Determina el tipo_ajuste automáticamente
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
            // Llama al POST /api/inventario/ajuste
            const response = await fetch(`${API_URL}/inventario/ajuste`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_producto,
                    cantidad_ajustada,
                    tipo_ajuste,
                    id_usuario,
                    observaciones
                })
            });

            const result = await response.json();

            if (!response.ok) {
                // Maneja errores de validación del backend
                throw new Error(result.error || `Error ${response.status}: ${response.statusText}`);
            }
            
            setMensaje({ texto: '✅ Ajuste de inventario realizado con éxito!', tipo: 'success' });
            
            // Recargar productos para reflejar el nuevo stock sin recargar toda la página
            const updatedProductsResponse = await fetch(`${API_URL}/productos`);
            if (updatedProductsResponse.ok) {
                const updatedProducts: Producto[] = await updatedProductsResponse.json();
                setProductos(updatedProducts);
            }

            // Limpiar formulario
            setFormData(prev => ({ 
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
                        {productos.map(p => (
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