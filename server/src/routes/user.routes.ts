import {Router} from "express";
import { test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);