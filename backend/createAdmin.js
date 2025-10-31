const bcrypt = require('bcryptjs');
const database = require('./src/config/database');

(async () => {
  try {
    const pool = database.getPool();

    const nombre_usuario = 'Administrador';
    const email_usuario = 'administrador_sistema_ventas@gmail.com';
    const passwordPlano = 'protegidoadmin'; 
    const password_hash = await bcrypt.hash(passwordPlano, 10);
    const rol_usuario = 'ADMIN';

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre_usuario, email_usuario, password_hash, rol_usuario) VALUES (?, ?, ?, ?)`,
      [nombre_usuario, email_usuario, password_hash, rol_usuario]
    );

    console.log('Usuario creado correctamente:');
    console.log({
      id_usuario: result.insertId,
      nombre_usuario,
      email_usuario,
      passwordPlano,
      rol_usuario
    });

    process.exit(0);
  } catch (error) {
    console.error('Error al crear el usuario:', error.message);
    process.exit(1);
  }
})();
