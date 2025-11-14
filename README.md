# Modulo Nº16
### Registro de compras menores o gastos operativos.

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

![GET](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/leer.png?raw=true)    

Este método obtiene la lista completa de gastos registrados en la base de datos.

![GET?](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/parametros.png?raw=true)    

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

### Vistas

![Tabla](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/tabladegastos.png?raw=true)

![card01](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/creargastocard.png?raw=true)

![card02](https://github.com/Jacker-Lian/Sistemas-de-Ventas-e-Inventario/blob/feature/gestion-gastos-pr/media/gastocard.png?raw=true)

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

# Sistemas-de-Ventas-e-Inventario

- ssh root@161.132.47.234
# **DOCUMENTACION DE API-VENTAS**

# **POST    api/ventas/registrar**
-  Registra una venta
    - validacion de los datos requeridos  
    - Body(JSON) 
    ```json
    {

        "id_usuario": 2,
        "id_caja": 1,
        "id_sucursal": 1,
        "tipo_cliente": "ALUMNO",
        "metodo_pago": "EFECTIVO",
        "estado_venta": "COMPLETADA",
        
        
        "productos": [                      
          {
            "id_producto": 101,             
            "cantidad": 2,
            "precio_unitario": 5.00
          },
          {
            "id_producto": 102,
            "cantidad": 3,
            "precio_unitario": 5.17
          }
        ]
      }
    ```

     
# **PUT    api/ventas/cancelar**
-   Cancela una venta 
    - Mensaje condicionales para que el id_venta
    - Body(JSON)

    ```json
    {
        "id_venta": 1234,
        "id_motivo_cancelacion": 1234
    }
    ```
# **POST    api/ventas/Insertar-motivo-cancelacion**
- Registro de un nuevo motivo de cancelacion
-   Body(JSON)
```json

    {
        "descripcion": "producto malogrado"
    }

```


# **GET     api/ventas/Obtener-motivos-cancelacion**
-   se optine los datos de motivo de cancelacion de la base de datos 

```json
[
    {
       "id_motivo": 1,
    "descripcion": "llego frio la comida"
    },
    {
        "id_motivo": 2,
        "descripcion": "se cayo un plato"
    }
]
```


# **PUT api/ventas/Desactivar-motivo-cancelacion**
-   poner en un estado la cancelacion de una venta 
-   Body(JSON)
```json

    {
        "id_motivo_cancelacion": 1234
    }
    
```
# **PUT api/ventas/Desactivar_ventana**
-   desactiva la venta 
-   Body(JSON)
``` json
    {
        "id_venta": 1
    }
```
-   Respuestas
    -   Éxito
```json
    {
        "message": "Ventana desactivada exitosamente."
    }
```
**Código:** 200 OK

#### Errores
- **400 Bad Request**
```json
    {
        "message": "El id_ventana debe ser un número entero positivo."
    }
```

- **404 Not Found**
```json
    {
        "message": "Ventana no encontrada."
    }
```