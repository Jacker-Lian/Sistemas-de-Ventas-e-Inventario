import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { type Producto, type AjusteFormData, type AjusteRegistro } from '../../types/ajusteInventario'; 
import './AjusteInventario.css'; 

// URL Base del Backend (debe coincidir con tu app.js)
const API_URL = 'http://localhost:3000';
=======
import { useAuth } from '../../context/AuthContext';
import './AjusteInventario.css';
import { type Producto, type AjusteFormData } from '../../types/ajusteInventario';
const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
>>>>>>> main

const AjusteInventario: React.FC = () => {
    // --- ESTADOS ---
    const [productos, setProductos] = useState<Producto[]>([]);
<<<<<<< HEAD
    const [historial, setHistorial] = useState<AjusteRegistro[]>([]);
    const [tabActiva, setTabActiva] = useState<'ajuste' | 'historial'>('ajuste'); 
    
    // El Backend ahora requiere id_sucursal (se usa 1 como valor temporal)
=======
    const { user } = useAuth();
>>>>>>> main
    const [formData, setFormData] = useState<AjusteFormData>({
        id_producto: '',
        cantidad_ajustada: 0,
        tipo_ajuste: 'DISMINUCION',
<<<<<<< HEAD
        id_usuario: 1, // ID del usuario logueado (TEMPORAL)
        observaciones: '',
        id_sucursal: 1 // ID de la sucursal del usuario (TEMPORAL)
=======
        id_usuario: user?.id_usuario || '',
        observaciones: ''
>>>>>>> main
    });
        // Actualizar id_usuario en formData si cambia el usuario autenticado
        useEffect(() => {
            setFormData((prev) => ({ ...prev, id_usuario: user?.id_usuario || '' }));
        }, [user]);
    const [stockActual, setStockActual] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' | '' }>({ texto: '', tipo: '' });

<<<<<<< HEAD
    // --- EFECTOS Y FETCHES ---
    
    const fetchProductos = async () => {
        // Llama al GET /api/ajustes-inventario/productos que añadimos al Modelo
        try {
            const prodResp = await fetch(`${API_URL}/api/ajustes-inventario/productos`); 
            if (!prodResp.ok) throw new Error('No se pudo cargar la lista de productos.');
            const prodData: Producto[] = await prodResp.json();
            setProductos(prodData);
        } catch (error: any) {
            setMensaje({ texto: `Error al cargar datos iniciales: ${error.message}`, tipo: 'error' });
        }
    };
    
    const fetchHistorial = async () => {
        // Llama al GET /api/ajustes-inventario para el historial (obtenerTodos)
        try {
            const histResp = await fetch(`${API_URL}/api/ajustes-inventario`); 
            if (!histResp.ok) throw new Error('Error al cargar el historial de ajustes.');
            const histData: AjusteRegistro[] = await histResp.json();
            setHistorial(histData);
        } catch (error: any) {
            setMensaje({ texto: `Error al cargar historial: ${error.message}`, tipo: 'error' });
        }
    };
=======
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
>>>>>>> main

    useEffect(() => {
        fetchProductos();
        if (tabActiva === 'historial') {
            fetchHistorial();
        }
        // Limpiar mensajes al cambiar de pestaña
        setMensaje({ texto: '', tipo: '' });
    }, [tabActiva]);

    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
<<<<<<< HEAD
        setFormData(prev => ({ ...prev, [name]: (name === 'id_sucursal' || name === 'id_producto' || name === 'id_usuario') ? parseInt(value) : value }));
=======
        setFormData((prev: AjusteFormData) => ({ ...prev, [name]: value }));
>>>>>>> main
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
<<<<<<< HEAD
        setFormData(prev => ({ ...prev, id_producto: id }));
        const selectedProduct = productos.find(p => p.id_producto === id);
=======
        setFormData((prev: AjusteFormData) => ({ ...prev, id_producto: id }));
        const selectedProduct = productos.find((p: Producto) => p.id_producto === id);
>>>>>>> main
        setStockActual(selectedProduct ? selectedProduct.stock : null);
    };

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cantidad = parseFloat(e.target.value);
        const cantidadEntera = Math.trunc(cantidad); 
<<<<<<< HEAD
        setFormData(prev => ({ 
=======
        setFormData((prev: AjusteFormData) => ({ 
>>>>>>> main
            ...prev, 
            cantidad_ajustada: isNaN(cantidadEntera) ? 0 : cantidadEntera,
            tipo_ajuste: cantidadEntera >= 0 ? 'AUMENTO' : 'DISMINUCION' 
        }));
    };

    // --- SUBMIT: POST /api/ajustes-inventario ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        const { id_producto, cantidad_ajustada, observaciones, id_usuario, id_sucursal } = formData;
        const cantidadNumerica = Math.abs(cantidad_ajustada); 

        if (!id_producto || cantidadNumerica === 0 || !observaciones || !id_usuario || !id_sucursal) {
            setMensaje({ texto: 'Por favor, complete todos los campos (Producto, Cantidad, Observaciones).', tipo: 'error' });
            return;
        }

        try {
<<<<<<< HEAD
=======
            // Endpoint correcto según backend: /api/ajustes-inventario (POST)
            const token = localStorage.getItem('token') || '';
>>>>>>> main
            const response = await fetch(`${API_URL}/api/ajustes-inventario`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
<<<<<<< HEAD
                    ...formData,
                    cantidad_ajustada: cantidadNumerica 
=======
                    id_producto,
                    cantidad_ajustada,
                    tipo_ajuste,
                    id_usuario,
                    observaciones,
                    id_sucursal: 1 // TODO: reemplazar por sucursal dinámica
>>>>>>> main
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Error desconocido al registrar el ajuste.');
            }
            
            setMensaje({ texto: `Ajuste creado. Nuevo Stock: ${result.data.stock_nuevo}`, tipo: 'success' });
            
<<<<<<< HEAD
            // Limpiar formulario y recargar datos
            setFormData(prev => ({ ...prev, id_producto: '', cantidad_ajustada: 0, observaciones: '' }));
=======
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
>>>>>>> main
            setStockActual(null);
            fetchProductos(); 
            // Si la pestaña de historial está activa, la recargamos
            if (tabActiva === 'historial') fetchHistorial();

        } catch (error: any) {
            setMensaje({ texto: `Fallo al registrar el ajuste: ${error.message}`, tipo: 'error' });
        }
    };
    
    // --- Renderizado del Contenido Dinámico ---
    const renderContent = () => {
        if (tabActiva === 'ajuste') {
            // PESTAÑA 1: FORMULARIO
            return (
                <div className="formulario-ajuste">
                    <h3>Registro de Movimiento Manual</h3>
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
                        
                        {stockActual !== null && (
                            <p className="stock-info">
                                **Stock Actual:** {stockActual} unidades.
                            </p>
                        )}

                        {/* 2. Cantidad a Ajustar */}
                        <div className="form-group">
                            <label htmlFor="cantidad_ajustada">Cantidad de Ajuste:</label>
                            <p className="nota-ayuda">
                                Positivo para **AUMENTO**, negativo para **DISMINUCION**. Tipo: **{formData.tipo_ajuste}**
                            </p>
                            <input 
                                type="number" 
                                name="cantidad_ajustada" 
                                value={formData.cantidad_ajustada} 
                                onChange={handleCantidadChange} 
                                required 
                                step="1"
                            />
                        </div>
                        
                         {/* 3. Observaciones / Motivo */}
                        <div className="form-group">
                            <label htmlFor="observaciones">Observaciones (Motivo):</label>
                            <textarea 
                                name="observaciones" 
                                value={formData.observaciones} 
                                onChange={handleChange}
                                placeholder="Ej: Pérdida por rotura"
                                maxLength={255}
                                required
                            />
                        </div>
                        
                        {/* 4. Campo de Sucursal (Temporalmente Fijo) */}
                        <div className="form-group">
                            <label htmlFor="id_sucursal">Sucursal (Actual):</label>
                            <select 
                                name="id_sucursal" 
                                value={formData.id_sucursal} 
                                onChange={handleChange}
                                required
                                disabled // Lo deshabilitamos si asumimos que es fijo
                            >
                                <option value={1}>Sucursal Principal (ID: 1)</option>
                            </select>
                        </div>
                        
                        {/* Campos Ocultos de Seguridad/Relación */}
                        <input type="hidden" name="id_usuario" value={formData.id_usuario} />
                        
                        <button type="submit" className="btn-guardar">
                            Registrar Ajuste ({formData.tipo_ajuste})
                        </button>
                    </form>
                </div>
            );
        } else {
            // PESTAÑA 2: HISTORIAL
            return (
                 <div className="historial-tabla-container">
                    <h3>Historial de Movimientos Manuales</h3>
                    <table className="tabla-ajustes">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Sucursal</th>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Stock Final</th>
                                <th>Usuario</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.length === 0 ? (
                                <tr><td colSpan={8}>No hay registros de ajustes.</td></tr>
                            ) : (
                                historial.map((reg) => (
                                    <tr key={reg.id_ajuste} className={reg.tipo_ajuste === 'DISMINUCION' ? 'ajuste-salida' : 'ajuste-entrada'}>
                                        <td>{new Date(reg.fecha_creacion).toLocaleDateString()}</td>
                                        <td>{reg.nombre_sucursal}</td>
                                        <td>{reg.nombre_producto}</td>
                                        <td className={`tipo-${reg.tipo_ajuste.toLowerCase()}`}>{reg.tipo_ajuste}</td>
                                        <td>{reg.cantidad_ajustada}</td>
                                        <td>{reg.stock_nuevo}</td>
                                        <td>{reg.nombre_usuario}</td>
                                        <td>{reg.observaciones}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            );
        }
    };


    // --- Renderizado de Tabs ---
    return (
        <div className="container-ajuste">
            <h2>Ajuste Manual de Inventario</h2>
            
            {/* Mensajes de Retroalimentación */}
            {mensaje.texto && (
                <div className={`alerta ${mensaje.tipo === 'error' ? 'alerta-error' : 'alerta-exito'}`}>
                    {mensaje.texto}
                </div>
            )}

<<<<<<< HEAD
            {/* Componente de Pestañas (Tabs) */}
            <div className="tabs">
                <button 
                    className={`tab-btn ${tabActiva === 'ajuste' ? 'active' : ''}`}
                    onClick={() => setTabActiva('ajuste')}
                >
                    1. Realizar Ajuste
=======
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
>>>>>>> main
                </button>
                <button 
                    className={`tab-btn ${tabActiva === 'historial' ? 'active' : ''}`}
                    onClick={() => setTabActiva('historial')}
                >
                    2. Historial de Ajustes
                </button>
            </div>
            
            {/* Contenido Dinámico de Pestañas */}
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AjusteInventario;
