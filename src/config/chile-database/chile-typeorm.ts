import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChileEntities } from './chile-entities.typeorm';
import { CL_DB_HOST, CL_DB_NAME, CL_DB_PASSWORD, CL_DB_USERNAME, DB_PORT } from 'src/shared/constants/connection.constant';


export const ChileTypeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  name:"CL",
  host: CL_DB_HOST,
  port: Number(DB_PORT ?? 3306),
  username: CL_DB_USERNAME,
  password: CL_DB_PASSWORD,
  database: CL_DB_NAME,
  entities: ChileEntities,
  synchronize: false,
  logging: false,
  connectTimeout: 5000,
};

