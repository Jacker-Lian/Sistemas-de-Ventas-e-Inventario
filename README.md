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