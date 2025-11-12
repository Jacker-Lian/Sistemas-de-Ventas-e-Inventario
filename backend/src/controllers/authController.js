const UsuarioModel = require('../models/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const usuarioModel = new UsuarioModel();

const authController = {};

// POST /api/auth/login
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y password son requeridos' 
      });
    }

    // Obtener usuario por email
    const usuario = await usuarioModel.obtenerPorEmail(email);

    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({ 
        success: false,
        message: 'Usuario inactivo' 
      });
    }

    // Verificar contraseña
    const passwordMatches = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    const payload = {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      email_usuario: usuario.email_usuario,
      rol: usuario.rol_usuario
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    // Configurar cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000 
    });

    // Determinar redirección según rol
    let redirect = '/caja';
    if (usuario.rol_usuario === 'ADMIN') redirect = '/admin';
    if (usuario.rol_usuario === 'SUPERVISOR') redirect = '/reportes';

    return res.json({
      success: true,
      message: 'Autenticación exitosa',
      data: {
        user: {
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          email_usuario: usuario.email_usuario,
          rol_usuario: usuario.rol_usuario
        },
        redirect,
        token // Incluir token en respuesta para APIs
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor en autenticación' 
    });
  }
};

// POST /api/auth/logout
authController.logout = async (req, res) => {
  try {
    // Limpiar cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax"
    });

    return res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al cerrar sesión' 
    });
  }
};

// GET /api/auth/me (verificar sesión)
authController.getCurrentUser = async (req, res) => {
  try {
    // El middleware de autenticación ya adjuntó el usuario a req.usuario
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'No autenticado' 
      });
    }

    return res.json({
      success: true,
      data: {
        user: req.usuario
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor al verificar sesión' 
    });
  }
};

module.exports = authController;