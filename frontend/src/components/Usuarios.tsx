import React, { useState, useEffect, useCallback } from "react";

const Server = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

interface UsuarioRaw {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  rol_usuario: string;
  estado: number | boolean | string | null | undefined;
  fecha_creacion?: string;
}

interface EditUsuarioState {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
}

export default function Usuarios() {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState<UsuarioRaw[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState<EditUsuarioState | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [cNombre, setCNombre] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [cRol, setCRol] = useState("CAJA");

  // 🔹 Buscar usuarios
  const buscarUsuarios = useCallback(async () => {
    const q = busqueda.trim();
    setMensaje("Cargando...");
    try {
      const url = q
        ? `${Server}/api/usuario/buscar/${encodeURIComponent(q)}`
        : `${Server}/api/usuario/listar`;
      const res = await fetch(url);
      if (res.status === 404) {
        setUsuarios([]);
        setMensaje(q ? `No se encontraron coincidencias para "${q}"` : "No hay usuarios disponibles.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr: UsuarioRaw[] = Array.isArray(data) ? data : data.users ?? [];
      const normalized = arr.map((u) => ({
        id_usuario: Number(u.id_usuario),
        nombre_usuario: u.nombre_usuario ?? "",
        email_usuario: u.email_usuario ?? "",
        rol_usuario: u.rol_usuario ?? "CAJA",
        estado: u.estado === undefined || u.estado === null ? 1 : Number(u.estado),
        fecha_creacion: u.fecha_creacion,
      }));
      setUsuarios(normalized);
      setMensaje(normalized.length && q ? `Resultados para "${q}"` : "");
      if (!normalized.length && !q) setMensaje("No hay usuarios registrados.");
    } catch (err) {
      console.error(err);
      setMensaje("Error al obtener usuarios");
    }
  }, [busqueda]);

  useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);

  // 🔹 Guardar cambios edición
  const guardarCambios = async () => {
    if (!editando) return;
    if (!editando.nombre_usuario.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }
    try {
      const payload = {
        nombre_usuario: String(editando.nombre_usuario).trim(),
        email_usuario: String(editando.email_usuario).trim(),
      };
      const res = await fetch(`${Server}/api/usuario/actualizar/${editando.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(data.message || "Usuario actualizado");
      setEditando(null);
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar usuario");
    }
  };

  // 🔹 Desactivar usuario
  const desactivarUsuario = async (id: number) => {
    const u = usuarios.find((x) => x.id_usuario === id);
    if (!u || !confirm(`¿Deseas desactivar a "${u.nombre_usuario}"?`)) return;
    try {
      const res = await fetch(`${Server}/api/usuario/eliminar/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(data.message || "Usuario desactivado");
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje("Error al desactivar usuario");
    }
  };

  // 🔹 Selección masiva
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const selectAll = () => {
    if (selectedIds.length === usuarios.length) setSelectedIds([]);
    else setSelectedIds(usuarios.map((u) => u.id_usuario));
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return alert('Selecciona al menos un usuario');
    if (!confirm(`¿Desactivar los ${selectedIds.length} usuarios seleccionados?`)) return;
    try {
      for (const id of selectedIds) {
        await fetch(`${Server}/api/usuario/eliminar/${id}`, { method: 'DELETE' });
      }
      setMensaje(`${selectedIds.length} usuario(s) desactivado(s)`);
      setSelectedIds([]);
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje('Error al eliminar usuarios');
    }
  };

  // 🔹 Crear usuario
  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cNombre.trim() || !cEmail.trim() || !cPassword.trim()) {
      setMensaje('Nombre, email y contraseña son requeridos');
      return;
    }
    try {
      const payload = { nombre_usuario: cNombre.trim(), email_usuario: cEmail.trim(), password: cPassword, rol_usuario: cRol };
      const res = await fetch(`${Server}/api/usuario/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(data.message || 'Usuario creado');
      setShowCreate(false);
      setCNombre(''); setCEmail(''); setCPassword(''); setCRol('CAJA');
      buscarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje('Error al crear usuario');
    }
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditando((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  return (
    <div className="crud-container" style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: "1000px", margin: "24px auto", padding: "18px", border: "1px solid #000", borderRadius: "8px", backgroundColor: "#fff", color: "#000" }}>
      <h1 style={{ textAlign: "center", textTransform: "uppercase", marginBottom: 8 }}>Gestión de Usuarios</h1>
      <p style={{ textAlign: "center", marginBottom: 18 }}>Busca, edita o desactiva usuarios.</p>

      {/* Buscador */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={handleBusquedaChange}
          style={{ width: "60%", padding: 8, border: "1px solid #000", borderRadius: 6 }}
        />
      </div>
      <p style={{ textAlign: "center", fontStyle: "italic", color: "#555" }}>{mensaje}</p>

      {/* Botones Crear / Eliminar masivos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div>
          <button onClick={() => setShowCreate(true)} style={{ padding: '6px 10px', borderRadius: 6 }}>Nuevo</button>
        </div>
        <div>
          <button onClick={handleBulkDelete} disabled={selectedIds.length === 0} style={{ padding: '6px 10px', borderRadius: 6 }}>Eliminar seleccionados</button>
        </div>
      </div>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, border: "1px solid #000" }}>
        <thead>
          <tr style={{ background: "#000", color: "#fff", textTransform: "uppercase" }}>
            <th style={{ padding: 10, border: "1px solid #000" }}>
              <input type="checkbox" onChange={selectAll} checked={selectedIds.length === usuarios.length && usuarios.length > 0} />
            </th>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? usuarios.map((u) => {
            const isInactive = Number(u.estado) === 0;
            const isEditing = editando?.id_usuario === u.id_usuario;
            return (
              <tr key={u.id_usuario} style={{ opacity: isInactive ? 0.6 : 1, textDecoration: isInactive ? "line-through" : "none" }}>
                <td><input type="checkbox" checked={selectedIds.includes(u.id_usuario)} onChange={() => toggleSelect(u.id_usuario)} /></td>
                <td>{u.id_usuario}</td>
                <td>{isEditing ? <input name="nombre_usuario" value={editando?.nombre_usuario || ""} onChange={handleEditChange} /> : u.nombre_usuario}</td>
                <td>{isEditing ? <input name="email_usuario" value={editando?.email_usuario || ""} onChange={handleEditChange} /> : u.email_usuario}</td>
                <td>{u.rol_usuario}</td>
                <td>{isInactive ? "Inactivo" : "Activo"}</td>
                <td>
                  {!isInactive && (isEditing
                    ? <>
                        <button onClick={guardarCambios}>Guardar</button>
                        <button onClick={() => setEditando(null)}>Cancelar</button>
                      </>
                    : <>
                        <button onClick={() => setEditando({ id_usuario: u.id_usuario, nombre_usuario: u.nombre_usuario, email_usuario: u.email_usuario })}>Editar</button>
                        <button onClick={() => desactivarUsuario(u.id_usuario)}>Desactivar</button>
                      </>)}
                </td>
              </tr>
            );
          }) : <tr><td colSpan={7} style={{ textAlign: 'center' }}>Sin resultados</td></tr>}
        </tbody>
      </table>

      {/* Modal Crear */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, width: 520, maxWidth: '95%', color: '#000' }}>
            <h3>Nuevo usuario</h3>
            <form onSubmit={handleCreate}>
              <label>Nombre<input value={cNombre} onChange={(e) => setCNombre(e.target.value)} required /></label>
              <label>Email<input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} required /></label>
              <label>Contraseña<input type="password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} required /></label>
              <label>Rol
                <select value={cRol} onChange={(e) => setCRol(e.target.value)}>
                  <option value="CAJA">Caja</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </label>
              <button type="submit">Crear</button>
              <button type="button" onClick={() => setShowCreate(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

