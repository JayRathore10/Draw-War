import {Request , Response , NextFunction} from "express";
import { User } from "../models/user.model";

export const test = async(req : Request , res : Response ,next : NextFunction)=>{
  try{
    return res.status(200).json({
      success : true  , 
      message : "All alright"
    })
  }catch(error){
    next(error);
  }
}

export const getAllUser = async(req : Request , res : Response  , next : NextFunction)=>{
  try{
    const users = await User.find();

    if(!users){
      return res.status(404).json({
        success : false, 
        message : "No users are found"
      })
    }

    return res.status(200).json({
      success : true  , 
      message : "All Users" , 
      users
    })

  }catch(error){
    next(error);
  }
}