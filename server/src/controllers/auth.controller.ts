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

