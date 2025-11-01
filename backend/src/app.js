const express = require('express');
const cors = require('cors');
const UsuarioRoutes = require('./routes/apisRoutes');
const CategoriaRoutes = require('./routes/categoriaRoutes');

class App {
  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
  }

  configurarMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // Middleware para logear todas las peticiones
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  configurarRutas() {
    this.app.get('/', (req, res) => {
      res.json({
        mensaje: 'API funcionando',
        endpoints: {
          usuario_login: '/api/usuario/login',
          categorias: '/api/categoria'
        }
      });
    });

    // Montar rutas de usuario
    const usuarioRoutes = new UsuarioRoutes();
    this.app.use('/api/usuario', usuarioRoutes.getRouter());

    // Montar rutas de categoria
    const categoriaRoutes = new CategoriaRoutes();
    this.app.use('/api/categoria', categoriaRoutes.getRouter());

    // Ruta 404
    this.app.use((req, res) => {
      res.status(404).json({ success: false, mensaje: 'Ruta no encontrada' });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
