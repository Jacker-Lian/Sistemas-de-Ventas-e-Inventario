const UsuarioModel = require('../models/apisModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const usuarioModel = new UsuarioModel();

const authController = {};

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

    const passwordHash = usuario.password_hash || usuario.passwordHash || usuario.password;
    const passwordMatches = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Datos almacenados
    const payload = {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      email_usuario: usuario.email_usuario,
      rol: usuario.rol_usuario
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    // redirección según rol
    let redirect = '/caja';
    if (usuario.rol_usuario === 'ADMIN') redirect = '/admin';

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

// =======================
// AJUSTES DE INVENTARIO
// =======================

authController.obtenerAjustes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id_ajuste,
        p.nombre AS producto,
        a.tipo_ajuste,
        a.cantidad_ajustada,
        a.motivo,
        a.stock_anterior,
        a.stock_nuevo,
        u.nombre_usuario,
        a.fecha_creacion
      FROM ajustes_inventario a
      JOIN producto p ON a.id_producto = p.id_producto
      JOIN usuarios u ON a.id_usuario = u.id_usuario
      ORDER BY a.fecha_creacion DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener ajustes:", error);
    res.status(500).json({ error: "Error al obtener ajustes de inventario" });
  }
};

authController.crearAjuste = async (req, res) => {
  const { id_producto, cantidad_ajustada, tipo_ajuste, motivo, id_usuario, observaciones } = req.body;

  try {
    // Verificar producto
    const [producto] = await db.query("SELECT stock FROM producto WHERE id_producto = ?", [id_producto]);
    if (producto.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const stock_anterior = producto[0].stock;
    let stock_nuevo = stock_anterior;

    // Calcular nuevo stock
    if (tipo_ajuste === "AUMENTO") {
      stock_nuevo += cantidad_ajustada;
    } else if (tipo_ajuste === "DISMINUCION") {
      if (cantidad_ajustada > stock_anterior) {
        return res.status(400).json({ error: "No hay suficiente stock para disminuir" });
      }
      stock_nuevo -= cantidad_ajustada;
    }

    // Registrar ajuste
    await db.query(
      `INSERT INTO ajustes_inventario 
      (id_producto, cantidad_ajustada, tipo_ajuste, motivo, id_usuario, stock_anterior, stock_nuevo, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_producto, cantidad_ajustada, tipo_ajuste, motivo, id_usuario, stock_anterior, stock_nuevo, observaciones]
    );

    // Actualizar stock
    await db.query("UPDATE producto SET stock = ? WHERE id_producto = ?", [stock_nuevo, id_producto]);

    res.json({ mensaje: "Ajuste registrado correctamente", stock_nuevo });
  } catch (error) {
    console.error("Error al registrar ajuste:", error);
    res.status(500).json({ error: "Error al registrar ajuste de inventario" });
  }
};

module.exports = authController;
