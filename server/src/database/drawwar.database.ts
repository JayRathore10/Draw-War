import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "../configs/env.config";

if(!MONGO_URI){
  throw new Error("Error in connecting DB");
}

export const connectDatabase = async()=>{
  try{
    await mongoose.connect(MONGO_URI as string);
    console.log("Database connnect successfully" , NODE_ENV , "environment");
  }catch(err){
    console.error("Error in connecting Database" , err);
    process.exit();
  }
}