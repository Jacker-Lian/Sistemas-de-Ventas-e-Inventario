module.exports = {
  apps: [
    {
      name: "backend-api",         // Nombre del proceso en PM2
      script: "npm",               // Ejecuta npm
      args: "start",               // Usa el script "start" del package.json
      cwd: "/root/app/backend",    // Ruta donde estará el backend en el servidor
      env: {
        NODE_ENV: "production",    // Entorno de producción
        PORT: 3000,                // Puerto en que correrá tu API (puedes cambiarlo)
      },
      autorestart: true,           // Reinicia si se cae
      watch: false,                // No vigila cambios (para producción)
      max_memory_restart: "300M",  // Reinicia si supera este uso de memoria
      out_file: "/root/app/backend/logs/out.log", // Logs estándar
      error_file: "/root/app/backend/logs/error.log", // Logs de errores
      time: true,                  // Agrega timestamps en los logs
    },
  ],
};
