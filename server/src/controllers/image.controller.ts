import {Request , Response , NextFunction} from "express";
import fs from "fs";
import path from "path";

export const compareImages = async(req : Request, res : Response , next : NextFunction)=>{
  try{
    const {
      roundId , 
      player1ImageName , 
      player2ImageName , 
      player1Base64 , 
      player2Base64 
    } = req.body;

    res.json({
      success : true
    })

  }catch(error){
    next(error);
  }
}