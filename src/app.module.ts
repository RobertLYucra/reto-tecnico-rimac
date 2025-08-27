import { Module } from '@nestjs/common';
import { ChileTypeORMConfig } from './config/chile-database/chile-typeorm';
import { PeruTypeORMConfig } from './config/peru-database/peru-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from './modules/appointment/infraestructure/appointment.module';
import { AppointmentPeruModule } from './modules/appointment-peru/infraestructure/appointment-peru.module';
import { AppointmentChileModule } from './modules/appointment-chile/infraestructure/appointment-chile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(PeruTypeORMConfig), // conexión PE
    TypeOrmModule.forRoot(ChileTypeORMConfig),// conexión CL
    AppointmentModule,
    AppointmentPeruModule,
    AppointmentChileModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
