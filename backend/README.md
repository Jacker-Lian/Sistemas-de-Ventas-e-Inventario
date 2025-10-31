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

---

### Ejemplo de JSON para crear

---

### Respuesta de ejemplo



---

### Estructura

```plaintext
backend/
├─ server.mjs                 
├─ src/
│  ├─ config/
│  │  └─ database.mjs
│  ├─ controllers/
│  │  └─ gastos.controller.mjs
│  ├─ routes/
│  │  └─ gastos.router.mjs
│  └─ models/
````
---

## Versiones y dependencias

- `node --version v22.21.0`
- `express`
- `mysql2`
- `dotenv`
- `cors`
