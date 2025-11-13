import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('CAJA');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');

    if (!nombre || !email || !password) {
      setMensaje('Todos los campos son requeridos');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre_usuario: nombre,
        email_usuario: email,
        password,
        rol_usuario: rol,
      };

  // Alineado con el backend: endpoint de registro en /api/usuario/register
  const res = await api.post('/usuario/register', payload);

      if (res.status === 201 || res.status === 200) {
        setMensaje('Registro exitoso. Redirigiendo a inicio de sesión...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMensaje(res.data?.message || 'Registro completado');
      }
    } catch (error: any) {
      setMensaje(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-root">
      <div className="register-container">
        <form className="register-card" onSubmit={handleSubmit}>
          <h2>Crear cuenta</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
            Regístrate para acceder al sistema
          </p>

          <label>
            Nombre completo
            <input
              name="nombre_usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre completo"
            />
          </label>

          <label>
            Correo electrónico
            <input
              name="email_usuario"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label>
            Contraseña
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          <label>
            Rol
              <select name="rol_usuario" value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="CAJA">Caja</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>

          {mensaje && <p style={{ marginTop: '0.6rem', color: '#b00020' }}>{mensaje}</p>}

          <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
            ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
