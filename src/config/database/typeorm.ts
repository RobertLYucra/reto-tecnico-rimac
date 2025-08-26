import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from './entities.typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from 'src/shared/constants/connection.constant';

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities,
  synchronize: false,
  logging: false,
  connectTimeout: 5000,
};

