import 'dotenv/config';

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const NEXA_REGION = process.env.SNAP_REGION;
export const NEXA_BUCKET = process.env.SNAP_BUCKET;
export const SENDGRID_MAIN_API = process.env.SENDGRID_MAIN_API;
export const API_SES_SINAPSIS = process.env.API_SES_SINAPSIS;

export const PLATFORM = "snap-2"
export const MODULE = "mailing"
export const TASK = "campaign"
export const STAGE = NEXA_REGION != "us-east-2" ? "prod" : "test"
export const ENVIRONMENT = NEXA_REGION != "us-east-2" ? "prod" : "test"

//Pusher
//export const PUSHER_APP_ID = process.env.PUSHER_APP_ID
//export const PUSHER_KEY = process.env.PUSHER_KEY
//export const PUSHER_SECRET = process.env.PUSHER_SECRET
//export const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER