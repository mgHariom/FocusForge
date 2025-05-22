import { config } from "dotenv";

//path to env file 
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

export const {
    PORT, NODE_ENV,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,

} = process.env;

if (!PORT) {
    throw new Error('PORT is not defined in env');
}