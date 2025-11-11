const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return res.status(401).json({ message: "No autorizado: token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }
    next();
  };
};

module.exports = { verificarToken, requireRole };