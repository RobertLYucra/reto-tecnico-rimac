import 'dotenv/config';

export const DB_PORT = process.env.DB_PORT;

//PERU CONNECTIONS
export const PE_DB_HOST = process.env.PE_DB_HOST;
export const PE_DB_USERNAME = process.env.PE_DB_USERNAME;
export const PE_DB_PASSWORD = process.env.PE_DB_PASSWORD;
export const PE_DB_NAME = process.env.PE_DB_NAME;

//CHILE CONNECTIONS
export const CL_DB_HOST = process.env.CL_DB_HOST;
export const CL_DB_USERNAME = process.env.CL_DB_USERNAME;
export const CL_DB_PASSWORD = process.env.CL_DB_PASSWORD;
export const CL_DB_NAME = process.env.CL_DB_NAME;

export const APP_REGION = process.env.APP_REGION;
export const APPOINTMENT_TABLE_NAME = process.env.APPOINTMENT_TABLE_NAME
export const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN


export const STAGE = APP_REGION != "us-east-2" ? "prod" : "test"
export const ENVIRONMENT = APP_REGION != "us-east-2" ? "prod" : "test"
