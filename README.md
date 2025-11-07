# Sistemas-de-Ventas-e-Inventario

🔑 Acceso y Administración del Servidor

El siguiente comando es la "llave" para acceder al servidor donde está instalado el sistema.
Solo lo deben usar administradores o desarrolladores autorizados para tareas de mantenimiento, despliegue y recuperación.

ssh root@161.132.47.234

🧩 ¿Qué es?

SSH (Secure Shell) es un protocolo que permite conectarse de forma segura a la consola de otra máquina por la red.
Con él se obtiene acceso directo al servidor para ejecutar comandos, editar configuraciones, ver logs, gestionar servicios, subir archivos y administrar bases de datos.

⚙️ ¿Para qué se usa? — Casos comunes

🚀 Desplegar código: ejecutar git pull, npm install, composer install, etc.

🔁 Reiniciar servicios: systemctl restart my-service o service nginx restart.

📜 Ver logs en tiempo real: tail -f /var/log/nginx/access.log o journalctl -u my-service -f.

🧠 Inspección y debugging: monitorear CPU/RAM (top, htop), conexiones de red (ss, netstat).

💾 Copias de seguridad: ejecutar scripts de backup o usar rsync / scp para mover archivos.

📦 Gestión de paquetes: apt update && apt upgrade (Debian/Ubuntu) o yum update (CentOS).

🗄️ Administración de bases de datos: crear, modificar y gestionar MySQL, PostgreSQL, MongoDB, etc.

👥 Usuarios y permisos: adduser, usermod, configuración de sudoers.

🔐 Seguridad: revisar firewall (ufw, iptables), fail2ban, auditorías rápidas.

⚙️ Procesos en segundo plano: usar tmux, screen o systemd para tareas continuas.

🌐 Subir y administrar sitios web: alojar aplicaciones, páginas estáticas o sistemas completos en /var/www/ u otros directorios configurados con Nginx o Apache.

🧱 Crear y mantener bases de datos: instalar y configurar servidores de bases de datos, crear esquemas, usuarios y respaldos.

🗂️ Almacenar archivos y recursos: guardar imágenes, reportes, respaldos, documentos, etc.

🔗 Configurar dominios y certificados SSL: administrar DNS, configurar HTTPS con Let’s Encrypt o Cloudflare.

🕒 Automatizar tareas: usar cron para ejecutar tareas programadas (backups, limpieza de logs, reportes, etc.).
