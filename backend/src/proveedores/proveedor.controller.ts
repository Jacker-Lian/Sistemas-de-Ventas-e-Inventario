import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  // ✅ Obtener todos los proveedores
  @Get()
  findAll() {
    return this.proveedorService.findAll();
  }

  // ✅ Obtener un proveedor por su ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.findOne(id);
  }

  // ✅ Crear un proveedor
  @Post()
  create(@Body() dto: CreateProveedorDto) {
    return this.proveedorService.create(dto);
  }

  // ✅ Actualizar un proveedor
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProveedorDto,
  ) {
    return this.proveedorService.update(id, dto);
  }

  // ✅ Eliminar un proveedor
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorService.remove(id);
  }
}
