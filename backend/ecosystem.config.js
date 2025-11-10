module.exports = {
  apps: [
    {
      name: "backend-api",
      script: "npm",
      args: "start",
      cwd: "/root/app/backend",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      out_file: "/root/app/backend/logs/out.log",
      error_file: "/root/app/backend/logs/error.log",
      time: true,
    },
  ],
};