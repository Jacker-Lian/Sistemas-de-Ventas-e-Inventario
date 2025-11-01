import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedoresModule } from './proveedores/proveedores.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // tu contraseña de XAMPP si tienes una
      database: 'sistema_ventas',
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
    }),
    ProveedoresModule,
  ],
})
export class AppModule {}
