import { type User } from "../../../types/index.ts";
import jwt from "jsonwebtoken";
import userModel from "../models/User.ts"
import bcrypt from "bcryptjs";

export const signAccessToken = (user: any) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "5s",
    } as jwt.SignOptions
  );
};

export const signRefreshToken = (user: any) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET || "your_default_refresh_secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "1y",
    } as jwt.SignOptions
  );
};
