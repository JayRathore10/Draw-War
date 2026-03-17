import { Request , Response  , NextFunction} from "express";

export const test = async(req :Request , res : Response  , next : NextFunction)=>{
  try{
    res.status(200).json({
      success : true  , 
      message : "Test Clear"  
    })
  }catch(error){
    next(error);
  }
}

export const login = async(req : Request , res :Response , next : NextFunction)=>{
  try{  
    
  }catch(error){
    next(error);
  } 
}

export const signUp = async(req : Request , res : Response , next :NextFunction)=>{
  try{

  }catch(error){
    next(error);
  }
}

export const logOut = async(req : Request , res : Response ,next :NextFunction)=>{
  try{
  }catch(error){
    next(error);
  }
}

export const me = async(req : Request ,res : Response , next : NextFunction)=>{
  try{

  }catch(error){
    next(error);
  }
}


/**
 * Task have to write logic for the auth controller 
 */