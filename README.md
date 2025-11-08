# Sistemas-de-Ventas-e-Inventario

- ssh root@161.132.47.234
# **DOCUMENTACION DE API-VENTAS**

# **POST    api/ventas/registrar**
-  Registra una venta
    - validacion de los datos requeridos  
    - Body(JSON) 
    ```json
    {
        // DATOS DE LA VENTA (Encabezado)
        "id_usuario": 2,                    // ID del cajero (REQUERIDO)
        "id_caja": 1,                       // ID de la caja abierta (REQUERIDO)
        "id_sucursal": 1,                   // ID de la sucursal (OPCIONAL)
        "tipo_cliente": "ALUMNO",           // DOCENTE | ALUMNO | OTRO (REQUERIDO)
        "metodo_pago": "EFECTIVO",          // EFECTIVO | YAPE | PLIN | OTROS (REQUERIDO)
        "estado_venta": "COMPLETADA",       // COMPLETADA | PENDIENTE | CANCELADA (REQUERIDO)
        
        // PRODUCTOS VENDIDOS (Detalles)
        "productos": [                      // Array de productos (REQUERIDO, mínimo 1)
          {
            "id_producto": 101,             // ID del producto (REQUERIDO)
            "cantidad": 2,                  // Cantidad vendida (REQUERIDO, > 0)
            "precio_unitario": 5.00         // Precio por unidad (REQUERIDO)
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