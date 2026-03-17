import dotenv from "dotenv";

dotenv.config({path : `.env.${process.env.NODE_ENV || "development"}.local`});

export const {
  NODE_ENV ,
  MONGO_URI, 
  FRONTEND , 
  JWT_SECRET , 
  SALT_ROUND
} = process.env;