import { authRequest, userPlayLoad } from "../types/authRequest.type";
import { Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/env.config";
import { User } from "../models/user.model";

export const isUserLoggedIn = async(req : authRequest , res : Response , next : NextFunction)=>{
  try{
    const token = req.cookies.token ;

    if(!token){
      return res.status(400).json({
        success : false , 
        message : "Token not found"
      })
    }

    const decodedData = jwt.verify(token   , JWT_SECRET as string) as userPlayLoad;

    const user = await User.findOne({
      email : decodedData.email 
    }).select("-password");
  
    if(!user){
      return res.status(404).json({
        success : false , 
        message : "User Not found"
      })
    }

    req.user = user ;
    next();
  }catch(error){
    next(error);
  }
}