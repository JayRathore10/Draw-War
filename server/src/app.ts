import express  , {Request , Response} from "express";
import { authRouter } from "./routes/auth.routes";
import { FRONTEND } from "./configs/env.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes";
import { imageRouter } from "./routes/image.routes";

const app = express();

app.use(cors({
  origin: FRONTEND , 
  methods: ["GET", "POST" , "DELETE" , "PUT"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use( "/api/v1/auth" ,  authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images" , imageRouter);

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi , jexts here");
})

export default app;

/**
 * 
 * Make sure the image save  in proper png formate and i have access to open them easily 
 * and add the dummy ai model to understand the basic comaparison 
 * 
 * 
 */