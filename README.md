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

🗄️ Administración de bases de datos: crear, modificar y gestionar MySQL, PostgreSQL, MongoDB, etc.

🌐 Subir y administrar sitios web: alojar aplicaciones, páginas estáticas o sistemas completos en /var/www/ u otros directorios configurados con Nginx o Apache.

🧱 Crear y mantener bases de datos: instalar y configurar servidores de bases de datos, crear esquemas, usuarios y respaldos.



⚡️ Tutorial: Cómo subir y desplegar el Backend en el Servidor
A continuación se detalla el proceso completo para subir el backend al repositorio y desplegarlo en el servidor (VPS) usando Git.

crear un nuevo repositorio, crear una copia y poner los archvios ahi, subir los archvios con 

# Agregar todos los cambios al área de preparación
git add .

# Registrar los cambios con un mensaje descriptivo
git commit -m "Actualización del backend: nueva versión"

# Subir los cambios al repositorio remoto (GitHub, GitLab, etc.)
git push origin main



una ves subido ingresas al vps desde la terminal con  ssh root@161.132.47.234  pones la contraseña!! 
una estando ahi te crear una carpeta con mkdir"pones el nombre que desees!!"

entras a esa carpeta con "cd"  una ves estando dentro de la carpeta clones el repositorio con "git clone (link de tu repositorio)"

se bajaran todos los cambibos! 


⚙️ . Instalar dependencias

Si tu backend usa un gestor de dependencias (por ejemplo, Node.js, PHP o Python), instala o actualiza los paquetes:

# Ejemplo para Node.js
npm install


vas a tu carpeta compruebas que todos los archvios esten ahi con ls -ls  y luego sigue el suiguente paso 

🚀 . Iniciar o reiniciar el backend

Dependiendo de cómo se ejecute tu backend, puedes usar diferentes comandos.
Ejemplo con Node.js y PM2:

# Iniciar por primera vez
pm2 start app.js --name backend

# O reiniciar después de una actualización
pm2 restart backend


🧩 8. Verificar que todo funcione

Prueba el servidor accediendo a la URL o IP donde se aloja tu backend, por ejemplo:

http://"IP DEL SERVIDOR"/api


ambién puedes revisar los logs si algo falla:

# Ver logs en tiempo real (PM2)
pm2 logs 




