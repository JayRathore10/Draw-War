import {Router} from "express";
import { compareImages } from "../controllers/image.controller";

export const imageRouter = Router();

imageRouter.post("/compare" , compareImages);