import { Request, Response, NextFunction } from "express";
import { userLoginSchema, userZodSchema } from "../validation/user.validation";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { JWT_SECRET ,  SALT_ROUND } from "../configs/env.config";

export const test = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      message: "Test Clear"
    })
  } catch (error) {
    next(error);
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = userLoginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.format()
      })
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found"
      })
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "User password is incorrect"
      })
    }

    const token = jwt.sign({ email }, JWT_SECRET as string);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = userZodSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.format()
      })
    }

    const { username, email, password } = req.body;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(404).json({
        success: false,
        message: "User already exist",
      })
    }

    const salt = await bcrypt.genSalt(Number(SALT_ROUND));
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Error in creating user"
      })
    }

    const token = jwt.sign({ email }, JWT_SECRET as string);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true
    })

    return res.status(201).json({
      success: true,
      user,
      message: "New user created"
    })

  } catch (error) {
    next(error);
  }
}

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (error) {
    next(error);
  }
}


/**
 * Task have to write logic for the auth controller 
 */