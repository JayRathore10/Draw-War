import {Router} from "express";
import { getAllUser, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
// admin protected 
userRouter.get("/" , getAllUser);