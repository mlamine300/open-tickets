import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import userModel from "../models/User.ts";
import type { TokenPayload } from "../types/index.ts";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;

    const user = await userModel
      .findById(decoded.userId)
      .select("-password")
      .exec();
    if (!user) {
      return res.status(401).json({ message: "User not found or deleted" });
    }

    (req as any).user = user;
    //console.log(req.url + new Date().toISOString());
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(461).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid access token" });
  }
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "you don't have permission" });
  }
  const { role } = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as TokenPayload;

  if (!role || role !== "admin") {
    return res.status(401).json({ message: "you don't have asmin permission" });
  }
  next();
};
