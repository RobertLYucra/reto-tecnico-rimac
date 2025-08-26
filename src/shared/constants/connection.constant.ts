import 'dotenv/config';

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const APP_REGION = process.env.APP_REGION;
export const APPOINTMENT_TABLE_NAME = process.env.APPOINTMENT_TABLE_NAME

export const STAGE = APP_REGION != "us-east-2" ? "prod" : "test"
export const ENVIRONMENT = APP_REGION != "us-east-2" ? "prod" : "test"

//Pusher
//export const PUSHER_APP_ID = process.env.PUSHER_APP_ID
//export const PUSHER_KEY = process.env.PUSHER_KEY
//export const PUSHER_SECRET = process.env.PUSHER_SECRET
//export const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER