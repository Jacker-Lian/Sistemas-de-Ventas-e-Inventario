const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const usuarioModel = new UsuarioModel();

const authController = {};

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
      maxAge: 8 * 60 * 60 * 1000 
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

module.exports = authController;