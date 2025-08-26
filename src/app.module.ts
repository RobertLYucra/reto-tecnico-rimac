import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeORMConfig } from './config/database/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: async () => TypeORMConfig
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
