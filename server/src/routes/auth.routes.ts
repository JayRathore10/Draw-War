import { Router } from "express";
import { login, logOut, me, signUp, test } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login" , login);
authRouter.post("/signup" , signUp);
authRouter.post("/logout" , logOut);
authRouter.get("/me" , me);
authRouter.get("/test" , test);