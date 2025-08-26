import { Module } from '@nestjs/common';
import { TypeORMConfig } from './config/database/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppoitmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: async () => TypeORMConfig
  }),
    AppoitmentModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
