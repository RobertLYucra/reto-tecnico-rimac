import { Module } from '@nestjs/common';
import { ChileTypeORMConfig } from './config/chile-database/chile-typeorm';
import { PeruTypeORMConfig } from './config/peru-database/peru-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppoitmentModule } from './modules/appointment/infraestructure/appointment.module';
import { AppoitmentPEModule } from './modules/appointment-peru/infraestructure/appointment-pe.module';
import { AppoitmentClModule } from './modules/appointment-chile/infraestructure/appointment-cl.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(PeruTypeORMConfig), // conexión PE
    TypeOrmModule.forRoot(ChileTypeORMConfig),
    AppoitmentModule,
    AppoitmentPEModule,
    AppoitmentClModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
