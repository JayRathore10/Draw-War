import {Request , Response , NextFunction} from "express";

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