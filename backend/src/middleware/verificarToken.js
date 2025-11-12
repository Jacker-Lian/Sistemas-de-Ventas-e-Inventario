const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verificarToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const isDevelopment = process.env.NODE_ENV === 'production';

    // Permitir todas las solicitudes en desarrollo, omitiendo la verificación del token
    if (isDevelopment) {
      return next();
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

module.exports = verificarToken;
