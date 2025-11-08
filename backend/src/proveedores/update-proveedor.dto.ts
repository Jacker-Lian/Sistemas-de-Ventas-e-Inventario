import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedorDto } from './create-proveedor.dto';

export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {}
