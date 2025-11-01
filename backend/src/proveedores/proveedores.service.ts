import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';


@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  findAll() {
    return this.proveedorRepository.find();
  }

  findOne(id: number) {
    return this.proveedorRepository.findOneBy({ id_proveedor: id });
  }

  create(data: CreateProveedorDto) {
    const proveedor = this.proveedorRepository.create(data);
    return this.proveedorRepository.save(proveedor);
  }

  update(id: number, data: UpdateProveedorDto) {
    return this.proveedorRepository.update(id, data);
  }

  remove(id: number) {
    return this.proveedorRepository.delete(id);
  }
}
