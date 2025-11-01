import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 20, nullable: true })
  ruc: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 150, nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  correo: string;

  @Column({ length: 100, nullable: true })
  producto_principal: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ type: 'datetime' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'datetime' })
  fecha_actualizacion: Date;
}
