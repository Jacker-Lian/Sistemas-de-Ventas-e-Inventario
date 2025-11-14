# TODO: Corrección de Conflictos en CrudProductos.tsx y Archivos Relacionados

## Información Recopilada
- Verificación completa del backend: productoModel.js, productoController.js, productoRouters.js, app.js
- Campos devueltos por backend: id, nombre, precio (alias de precio_venta), stock, descripcion, estado
- Campos requeridos para envío: id, nombre, precio_venta, precio_compra, stock, descripcion, id_categoria, id_proveedor
- Endpoints: /api/productos/obtenerProductos, /api/productos/actualizarProducto, /api/productos/desactivarProducto

## Plan de Edición
- [ ] Actualizar interface Producto en CrudProductos.tsx para usar id y precio consistentes con backend
- [ ] Corregir normalización en buscarProductos para acceder a p.precio (no p.precio_venta)
- [ ] Agregar manejo de precio_compra en guardarCambios (valor por defecto 0)
- [ ] Actualizar tipos en ajusteInventario.ts para incluir campos consistentes
- [ ] Cambiar URL hardcodeada en AjusteInventario.tsx a usar import.meta.env.VITE_SERVER_URL
- [ ] Alinear interfaces entre archivos para evitar errores de tipo

## Archivos a Editar
- frontend/src/components/CrudProductos.tsx
- frontend/src/types/ajusteInventario.ts
- frontend/src/components/AjusteInventario/AjusteInventario.tsx

## Pasos Posteriores
- [ ] Verificar que las correcciones funcionen sin errores
- [ ] Probar funcionalidad de CRUD y ajustes de inventario
