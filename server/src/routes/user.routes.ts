import {Router} from "express";
import { getAllUser, getUserByUsername, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
// admin protected 
userRouter.get("/" , getAllUser);
// open route 
userRouter.get("/:username" , getUserByUsername );