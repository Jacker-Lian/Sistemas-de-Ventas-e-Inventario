# Modulo Nº16
### Registro de compras menores o gastos operativos.

---

### Iniciar backend

Primero configurar las variables de la base de datos en el archivo .env

Luego instalar las dependencias
```bash
npm install
```
Iniciar el servidor con 
```bash
node server.mjs
```
Y listo
```bash
el servidor se esta corriendo en http://localhost:3000
Conexión a MySQL establecida
```

---


### Endpoints disponibles

| Método | Endpoint        | Descripción              |
| ------ | ----------- | ------------------------ |
| GET    | /api/gastos | Leer todos los gastos |
| POST   | /api/gastos | Agregar un nuevo gasto     |
| GET    | /api/gastos/:id | Leer un gasto por id |
| PUT    | /api/gastos/:id | Editar un gasto por id |
| PATCH  | /api/gastos/:id | Eliminar un gasto por id |
| GET    | /api/gastos/tipos | obtener todos los tipos de gasto |
| POST   | /api/gastos/tipo  | crear un nuevo tipo de gasto |

---

### EJEMPLOS:

### LEER

![GET](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos/media/leer.png?raw=true)    

Este método obtiene la lista completa de gastos registrados en la base de datos.

![GET?](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos/media/parametros.png?raw=true)    

Se puede agregar parámetros en la URL como ``?page=2`` o ``?limit=3``.
También se puede combinarlos: ``?page=2&limit=3``
Esto permitira aplicar la paginación en el formulario ***(frontend)***


### CREAR

![POST](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/crear.png?raw=true)

**En caso de error**
- Respuesta del servidor (Postman): muestra un mensaje de error.
- Respuesta en la terminal: muestra el error con mayor detalle.

El error esta en la id_usuario el usuario 666 no existe en la base de datos

**Ejemplo de JSON:** en la terminal se muestra el uso del método ``POST`` para registrar un nuevo gasto.

### LEER POR ID

![GETBYID](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/leerporid.png?raw=true)

Este método obtiene un gasto específico utilizando su ID.
En la imagen se devuelve la informacion del gasto 33
Cuando se consulta un id que no existe (como el **666**) 

### EDITAR POR ID

![PUTBYID](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/editarporid.png?raw=true)

Metodo para editar un gasto, en el cual se envían los nuevos datos del gasto en el body de la petición.

### ELIMINAR POR ID

![PATCHBYID](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/eliminarporid.png?raw=true)

Este método permite **"eliminar"** un gasto. En realidad, realiza un softdelete que cambia el estado a =0 en la base de datos.

---

### Estructura

```plaintext
backend/
├─ server.js    
├─ src/
│  ├─ config/
│  │  └─ database.js
│  ├─ controllers/
│  │  └─ gastos.controller.js
|  ├─ models/
|  |  └─ gastoModel.js
│  ├─ routes/
│  │  └─ gastoRouter.js
````
---

## Versiones y dependencias

- `node --version v22.21.0`
- `express`
- `mysql2`
- `dotenv`
- `cors`
