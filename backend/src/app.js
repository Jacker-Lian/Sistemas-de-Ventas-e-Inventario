const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Importar todas las rutas
const UsuarioRoutes = require("./routes/usuarioRoutes");
const VentasRoutes = require("./routes/ventasRoutes");
const AjusteInventarioRoutes = require("./routes/ajusteInventarioRoutes");
const CajaRoutes = require("./routes/cajaRoutes");
const ProductoRoutes = require("./routes/productoRoutes");
const HistorialVentasRoutes = require('./routes/historialVentasRoutes');
const DetalleVentaRoutes = require('./routes/detalleVentaRoutes');
const MotivosCancelacionRoutes = require('./routes/motivosCancelacionRoutes');
const CategoriaRoutes = require('./routes/categoriaRoutes');

class App {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  configurarMiddlewares() {
    const ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
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
    
    // Middleware para logear todas las peticiones
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
          MotivosCancelacion: "/api/motivos-cancelacion",
          Categorias: "/api/categorias"
        },
      });
    });

    // Ruta de salud del servidor
    this.app.get("/health", (req, res) => {
      res.json({ 
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
      });
    });

    // Montar rutas de usuario/autenticación
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use("/api/usuario", usuarioRoutes.getRouter());

    // Montar rutas de ventas
    const ventasRoutesInstance = new VentasRoutes();
    this.app.use("/api/ventas", ventasRoutesInstance.getRouter());

    // Montar rutas de ajustes de inventario
    const ajusteInventarioRoutesInstance = new AjusteInventarioRoutes();
    this.app.use("/api/ajustes-inventario", ajusteInventarioRoutesInstance.getRouter());

    // Montar rutas de caja
    const cajaRoutesInstance = new CajaRoutes();
    this.app.use("/api/caja", cajaRoutesInstance.getRouter());

    // Montar rutas de productos
    const productoRoutesInstance = new ProductoRoutes();
    this.app.use("/api/productos", productoRoutesInstance.getRouter());

    // Montar rutas de historial de ventas
    const historialVentasRoutesInstance = new HistorialVentasRoutes();
    this.app.use("/api/historial-ventas", historialVentasRoutesInstance.getRouter());

    // Montar rutas de detalle de venta
    const detalleVentaRoutesInstance = new DetalleVentaRoutes();
    this.app.use("/api/detalle-venta", detalleVentaRoutesInstance.getRouter());

    // Montar rutas de motivos de cancelación
    const motivosCancelacionRoutesInstance = new MotivosCancelacionRoutes();
    this.app.use("/api/motivos-cancelacion", motivosCancelacionRoutesInstance.getRouter());

    // Montar rutas de categorías
    const categoriaRoutesInstance = new CategoriaRoutes();
    this.app.use("/api/categorias", categoriaRoutesInstance.getRouter());

    // Manejo de rutas no encontradas (404)
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
      if (error.message && error.message.includes('CORS')) {
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