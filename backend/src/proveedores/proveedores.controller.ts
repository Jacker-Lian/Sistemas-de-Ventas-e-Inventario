import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put 
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';


@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  // Obtener todos los proveedores
  @Get()
  findAll() {
    return this.proveedoresService.findAll();
  }

  // Obtener un proveedor por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(+id);
  }

  // Crear un nuevo proveedor
  @Post()
  create(@Body() data: CreateProveedorDto) {
    return this.proveedoresService.create(data);
  }

  // Actualizar un proveedor
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProveedorDto) {
    return this.proveedoresService.update(+id, data);
  }

  // Eliminar un proveedor
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedoresService.remove(+id);
  }
}
