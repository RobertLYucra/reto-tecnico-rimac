import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { clEntities } from './cl-entities.typeorm';
import { CL_DB_HOST, CL_DB_NAME, CL_DB_PASSWORD, CL_DB_USERNAME, DB_PORT } from 'src/shared/constants/connection.constant';


export const ClTypeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  name:"CL",
  host: CL_DB_HOST,
  port: Number(DB_PORT ?? 3306),
  username: CL_DB_USERNAME,
  password: CL_DB_PASSWORD,
  database: CL_DB_NAME,
  entities: clEntities,
  synchronize: false,
  logging: false,
  connectTimeout: 5000,
};

