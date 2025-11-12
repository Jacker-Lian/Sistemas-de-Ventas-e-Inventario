const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Importar las rutas actualizadas
const UsuarioRoutes = require("./routes/usuarioRoutes");
const VentasRoutes = require("./routes/ventasRoutes");
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const CajaRoutes = require("./routes/cajaRoutes");
const ProductoRoutes = require("./routes/productoRoutes");
const HistorialVentasRoutes = require('./routes/historialVentasRoutes');
const DetalleVentaRoutes = require('./routes/detalleVentaRoutes');
const MotivosCancelacionRoutes = require('./routes/motivosCancelacionRoutes');

class App {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  configurarMiddlewares() {
    const ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://38.250.161.15"
    ];

    this.app.use(cors({
      origin: function (origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          console.log('CORS bloqueado para origen:', origin);
          callback(new Error("CORS no permitido para este origen: " + origin));
        }
      },
      credentials: true
    }));

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  configurarRutas() {
    // Ruta de información principal
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        mensaje: "Backend de Sistema de Ventas e Inventario funcionando",
        timestamp: new Date().toISOString(),
        roles_disponibles: ["ADMIN", "CAJA"],
        endpoints: {
          Login: "/api/usuario",
          Ventas: "/api/ventas",
          AjustesInventario: "/api/ajustes-inventario",
          Caja: "/api/caja",
          Productos: "/api/productos",
          HistorialVentas: "/api/historial-ventas",
          DetalleVenta: "/api/detalle-venta",
          MotivosCancelacion: "/api/motivos-cancelacion"
        },
      });
    });

    // Ruta de salud
    this.app.get("/health", (req, res) => {
      res.json({ 
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
      });
    });

    // Instanciar y configurar todas las rutas
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use("/api/usuario", usuarioRoutes.getRouter());

    const ventasRoutesInstance = new VentasRoutes();
    this.app.use("/api/ventas", ventasRoutesInstance.getRouter());

    const ajusteInventarioRoutesInstance = new AjusteInventarioRoutes();
    this.app.use("/api/ajustes-inventario", ajusteInventarioRoutesInstance.getRouter());

    const cajaRoutesInstance = new CajaRoutes();
    this.app.use("/api/caja", cajaRoutesInstance.getRouter());

    const productoRoutesInstance = new ProductoRoutes();
    this.app.use("/api/productos", productoRoutesInstance.getRouter());

    const historialVentasRoutesInstance = new HistorialVentasRoutes();
    this.app.use("/api/historial-ventas", historialVentasRoutesInstance.getRouter());

    const detalleVentaRoutesInstance = new DetalleVentaRoutes();
    this.app.use("/api/detalle-venta", detalleVentaRoutesInstance.getRouter());

    const motivosCancelacionRoutesInstance = new MotivosCancelacionRoutes();
    this.app.use("/api/motivos-cancelacion", motivosCancelacionRoutesInstance.getRouter());

    // Manejo de rutas no encontradas
    this.app.use((req, res) => {
      res.status(404).json({ 
        success: false, 
        message: "Ruta no encontrada",
        path: req.path
      });
    });

    // Manejo global de errores
    this.app.use((error, req, res, next) => {
      console.error('Error global:', error);
      
      // Manejo específico para errores CORS
      if (error.message.includes('CORS')) {
        return res.status(403).json({
          success: false,
          message: 'Acceso no permitido desde este origen'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;