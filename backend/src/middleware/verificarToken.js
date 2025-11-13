const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar el token JWT
 */
const verificarToken = (req, res, next) => {
  try {
    // Buscar el token en cookies o en el header Authorization
    let token = req.cookies?.token;

    // Si no hay token en cookies, buscar en el header Authorization
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No autorizado: token no proporcionado" 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar información del usuario al request
    req.usuario = decoded;
    
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expirado" 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: "Token inválido o expirado" 
    });
  }
};

/**
 * Middleware para verificar que el usuario tenga uno de los roles requeridos
 * @param {Array<string>} roles - Array de roles permitidos (ej: ['ADMIN', 'CAJA'])
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario no autenticado" 
      });
    }

    // Verificar que el rol del usuario esté en la lista de roles permitidos
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        success: false,
        message: "No tienes permisos para realizar esta acción",
        rol_requerido: roles,
        rol_actual: req.usuario.rol
      });
    }

    next();
  };
};

module.exports = { 
  verificarToken, 
  requireRole 
};