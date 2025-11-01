const UsuarioModel = require('../models/apisModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const usuarioModel = new UsuarioModel();

const authController = {};

/**
 * POST /api/usuario/login
 * Body: { email, password }
 */
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email y password son requeridos' });

    const usuario = await usuarioModel.obtenerPorEmail(email);
    if (!usuario) return res.status(401).json({ message: 'El usuario no existe' });
    if (!usuario.estado) return res.status(403).json({ message: 'Usuario inactivo' });

    const passwordMatches = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatches) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const payload = {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      email_usuario: usuario.email_usuario,
      rol: usuario.rol_usuario
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    const redirect = (usuario.rol_usuario && usuario.rol_usuario.toUpperCase() === 'ADMIN') ? '/admin' : '/caja';

    return res.json({
      message: 'Autenticación exitosa',
      token,
      rol: usuario.rol_usuario,
      redirect,
      user: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        email_usuario: usuario.email_usuario,
        rol_usuario: usuario.rol_usuario
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

/**
 * POST /api/usuario/register
 * Body: { nombre_usuario, email_usuario, password, rol_usuario? }
 */
authController.register = async (req, res) => {
  try {
    const { nombre_usuario, email_usuario, password, rol_usuario } = req.body;
    if (!nombre_usuario || !email_usuario || !password) {
      return res.status(400).json({ message: 'nombre, email y password son requeridos' });
    }

    const existing = await usuarioModel.obtenerPorEmail(email_usuario);
    if (existing) return res.status(409).json({ message: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const role = (rol_usuario && String(rol_usuario).toUpperCase() === 'ADMIN') ? 'ADMIN' : 'USER';

    const user = await usuarioModel.crearUsuario({ nombre_usuario, email_usuario, password_hash: hashed, rol_usuario: role, estado: 1 });

    return res.status(201).json({ message: 'Usuario creado', user });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

/**
 * GET /api/usuario
 */
authController.listUsers = async (req, res) => {
  try {
    const users = await usuarioModel.listarUsuarios();
    return res.json({ users });
  } catch (error) {
    console.error('Error en listUsers:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

/**
 * GET /api/usuario/:id
 */
authController.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usuarioModel.obtenerPorId(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ user });
  } catch (error) {
    console.error('Error en getUser:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

/**
 * PUT /api/usuario/:id
 */
authController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, email_usuario, password, rol_usuario, estado } = req.body;

    // Si se cambia email, verificar no exista otro con ese email
    if (email_usuario) {
      const other = await usuarioModel.obtenerPorEmail(email_usuario);
      if (other && String(other.id_usuario) !== String(id)) {
        return res.status(409).json({ message: 'El email ya está en uso por otro usuario' });
      }
    }

    const fields = {};
    if (nombre_usuario) fields.nombre_usuario = nombre_usuario;
    if (email_usuario) fields.email_usuario = email_usuario;
    if (typeof estado !== 'undefined') fields.estado = estado ? 1 : 0;
    if (rol_usuario) fields.rol_usuario = String(rol_usuario).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    if (password) {
      fields.password_hash = await bcrypt.hash(password, 10);
    }

    const updated = await usuarioModel.actualizarUsuario(id, fields);
    if (updated === null) return res.status(400).json({ message: 'No hay campos para actualizar' });

    return res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error en updateUser:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

/**
 * DELETE /api/usuario/:id
 */
authController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const exist = await usuarioModel.obtenerPorId(id);
    if (!exist) return res.status(404).json({ message: 'Usuario no encontrado' });

    await usuarioModel.desactivarUsuario(id);
    return res.json({ message: 'Usuario desactivado' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

module.exports = authController;
