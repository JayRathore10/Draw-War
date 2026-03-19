import {Router} from "express";
import { getAllUser, getUserByUsername, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
// only admin can access 
userRouter.get("/" , getAllUser);
// open route 
userRouter.get("/:username" , getUserByUsername );