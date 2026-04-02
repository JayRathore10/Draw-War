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

    if(!roundId || !player1Base64 || !player2Base64 || !player1ImageName || !player2ImageName){
      return res.status(400).json({
        success : false , 
        messsage : "Some data entries are missing" ,
      });
    }

    const uploadDir = path.join(__dirname , "uploads");

    if(!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }

    const base64ToBuffer = (base64 : string)=>{
      const data = base64.replace("/^data:image\/png;base64,/" , "");
      return Buffer.from(data , "base64");
    };

    const player1Buffer = base64ToBuffer(player1Base64);
    const player2Buffer = base64ToBuffer(player2Base64);

    const player1Path = path.join(uploadDir , player1ImageName);
    const player2Path = path.join(uploadDir , player2ImageName);

    fs.writeFileSync(player1Path  , player1Buffer);
    fs.writeFileSync(player2Path , player2Buffer);

    console.log("Saved:" , player1ImageName , player2ImageName);

    res.json({
      message : "Images saved successfully" , 
      files : {
        player1: player1ImageName, 
        player2 : player2ImageName
      }
    });
  }catch(error){
    next(error);
  }
}
