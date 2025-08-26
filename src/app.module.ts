import { Module } from '@nestjs/common';
import { ClTypeORMConfig } from './config/chile-database/cl-typeorm';
import { PeTypeORMConfig } from './config/peru-database/pe-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppoitmentModule } from './modules/appointment/infraestructure/appointment.module';
import { AppoitmentPEModule } from './modules/appointment-pe/infraestructure/appointment-pe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(PeTypeORMConfig), // conexión PE
    TypeOrmModule.forRoot(ClTypeORMConfig),
    AppoitmentModule,
    AppoitmentPEModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
