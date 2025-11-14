const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const usuarioModel = new UsuarioModel();

const authController = {};
const usuarioController = {};
/**
 * POST /api/auth/login
 * Body: { email, password }
 */
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos' });
    }

    const usuario = await usuarioModel.obtenerPorEmail(email);

    if (!usuario) {
      return res.status(401).json({ message: 'El usuario no existe' });
    }

    if (!usuario.estado) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    const passwordMatches = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const payload = {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      email_usuario: usuario.email_usuario,
      rol: usuario.rol_usuario
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    // Redirección según rol
    let redirect = '/caja';
    if (usuario.rol_usuario === 'ADMIN') redirect = '/admin';

    return res.json({
      message: 'Autenticación exitosa',
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
 * GET /api/usuario
 */
usuarioController.listUsers = async (req, res) => {
  try {
    const users = await usuarioModel.listarUsuarios();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al listar usuarios' });
  }
};

/**
 * GET /api/usuario/:id
 */
usuarioController.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usuarioModel.obtenerPorId(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al obtener usuario' });
  }
};

usuarioController.createUser = async (req, res) => {
  try {
    const { nombre_usuario, email_usuario, password, rol_usuario } = req.body;

    if (!nombre_usuario || !email_usuario || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    const existing = await usuarioModel.obtenerPorEmail(email_usuario);
    if (existing) return res.status(409).json({ message: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const role = (rol_usuario && String(rol_usuario).toUpperCase() === 'ADMIN') ? 'ADMIN' : 'CAJA';

    const user = await usuarioModel.crearUsuario({ nombre_usuario, email_usuario, password_hash: hashed, rol_usuario: role });
    res.status(201).json({ message: 'Usuario creado', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al crear usuario' });
  }
};

/**
 * PUT /api/usuario/:id
 */
usuarioController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, email_usuario, password, rol_usuario, estado } = req.body;

    const fields = {};
    if (nombre_usuario) fields.nombre_usuario = nombre_usuario;
    if (email_usuario) fields.email_usuario = email_usuario;
    if (rol_usuario) fields.rol_usuario = String(rol_usuario).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CAJA';
    if (typeof estado !== 'undefined') fields.estado = estado ? 1 : 0;
    if (password) fields.password_hash = await bcrypt.hash(password, 10);

    const updated = await usuarioModel.actualizarUsuario(id, fields);
    if (updated === null) return res.status(400).json({ message: 'No hay campos para actualizar' });

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al actualizar usuario' });
  }
};

/**
 * DELETE /api/usuario/:id
 */
usuarioController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const exist = await usuarioModel.obtenerPorId(id);
    if (!exist) return res.status(404).json({ message: 'Usuario no encontrado' });

    await usuarioModel.desactivarUsuario(id);
    res.json({ message: 'Usuario desactivado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al desactivar usuario' });
  }
};

usuarioController.searchUsers = async (req, res) => {
  try {
    const { q } = req.params;
    const users = await usuarioModel.listarUsuarios();
    const filtered = users.filter(u =>
      u.nombre_usuario.toLowerCase().includes(q.toLowerCase()) ||
      u.email_usuario.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al buscar usuarios' });
  }
};

module.exports = { authController, usuarioController };
