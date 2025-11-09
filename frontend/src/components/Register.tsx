import React from 'react';

const Register: React.FC = () => {
  return (
    <main className="app-root">
      <div className="register-container">
        <form className="register-card" method="post" action="#">
          <h2>Crear cuenta</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
            Regístrate para acceder al sistema
          </p>

          <label>
            Nombre completo
            <input name="nombre_usuario" required placeholder="Tu nombre completo" />
          </label>

          <label>
            Correo electrónico
            <input name="email_usuario" type="email" required placeholder="correo@ejemplo.com" />
          </label>

          <label>
            Contraseña
            <input name="password" type="password" required placeholder="Mínimo 6 caracteres" />
          </label>

          <label>
            Rol
            <select name="rol_usuario" defaultValue="USER">
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <button type="submit" className="btn-primary">Registrarme</button>

          <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
            ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
