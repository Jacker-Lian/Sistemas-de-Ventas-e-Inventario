import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepo: Repository<Proveedor>,
  ) {}

  // ✅ Obtener todos los proveedores
  findAll() {
    return this.proveedorRepo.find();
  }

  // ✅ Obtener un proveedor por ID
  findOne(id: number) {
    return this.proveedorRepo.findOne({
      where: { id_proveedor: id },
    });
  }

  // ✅ Crear proveedor
  create(data: CreateProveedorDto) {
    const nuevo = this.proveedorRepo.create(data);
    return this.proveedorRepo.save(nuevo);
  }

  // ✅ Actualizar proveedor
  update(id: number, data: UpdateProveedorDto) {
    return this.proveedorRepo.update({ id_proveedor: id }, data);
  }

  // ✅ Eliminar proveedor
  remove(id: number) {
    return this.proveedorRepo.delete({ id_proveedor: id });
  }
}

