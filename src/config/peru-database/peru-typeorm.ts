  import { TypeOrmModuleOptions } from '@nestjs/typeorm';
  import { DB_PORT, PE_DB_HOST, PE_DB_NAME, PE_DB_PASSWORD, PE_DB_USERNAME } from 'src/shared/constants/connection.constant';
import { PeruEntities } from './peru-entities.typeorm';


  export const PeruTypeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    name: "PE",
    host: PE_DB_HOST,
    port: Number(DB_PORT ?? 3306),
    username: PE_DB_USERNAME,
    password: PE_DB_PASSWORD,
    database: PE_DB_NAME,
    entities: PeruEntities,
    synchronize: false,
    logging: false,
    connectTimeout: 5000,
  };