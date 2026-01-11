
import type { NextFunction, Response, Request } from "express";
import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.js";
import { signAccessToken, signRefreshToken } from "../utils/token.js";
import crypto from "crypto";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(!req?.body){
    return res.status(404).json({ message: "feild are required!" });
  }
  const { name, email, password, organisation, role } = req.body;
  if (!name || !email || !password)
    return res.status(404).json({ message: "feild are required!" });
  const existUserEmail = await userModel.findOne({ email }).lean().exec();
  const existUserName = await userModel.findOne({ name }).lean().exec();
  if (existUserEmail)
    return res.status(409).json({ message: "this email already taken" });
  if (existUserName)
    return res.status(409).json({ message: "this name already taken" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.insertOne({
      name,
      email,
      password: hashedPassword,
      organisation,
      role,
    });
    if (user) {
      const token = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      const hashed = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      user.refreshTokens.push({ token: hashed, ip: req.ip });
      await user.save();

      {
        const secure = process.env.NODE_ENV === "production";
        const cookieOpts: any = {
          httpOnly: true,
          secure,
          sameSite: secure ? "none" : "lax",
          path: "/",
          maxAge:
            Number(process.env.REFRESH_TOKEN_EXPIRES_IN_NUMBER) ||
            7 * 24 * 60 * 60 * 1000,
        };
        console.debug("Setting refresh cookie (register) opts:", cookieOpts);
        res.cookie("refreshToken", refreshToken, cookieOpts);
      }

      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organisation: user.organisation,
        token,
      });
    }
  } catch (error) {
    console.error("error regestring a user", error);
  }
  return res.status(500).json({ message: "server error" });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(404).json({ message: "email and password are required" });
  const foundUser = await userModel.findOne({ email }).select("").exec();

  if (!foundUser || !foundUser.password)
    return res.status(409).json({ message: "incorrect email or password" });
  if(!foundUser.activeStatus){
     return res.status(409).json({ message: "account is non active" });
  }
  const compare = await bcrypt.compare(password, foundUser.password);
  if (!compare)
    return res.status(409).json({ message: "incorrect email or password" });

  const accessToken = signAccessToken(foundUser);
  const refreshToken = signRefreshToken(foundUser);

  const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
  console.log("login token :", hashed);
  foundUser.refreshTokens.push({ token: hashed, ip: req.ip });

  await foundUser.save();
  {
    const secure = process.env.NODE_ENV === "production";
    const cookieOpts: any = {
      httpOnly: true,
      secure,
      sameSite: secure ? "none" : "lax",
      path: "/",
      maxAge:
        Number(process.env.REFRESH_TOKEN_EXPIRES_IN_NUMBER) ||
        7 * 24 * 60 * 60 * 1000,
    };
    console.debug("Setting refresh cookie (login) opts:", cookieOpts);
    res.cookie("refreshToken", refreshToken, cookieOpts);
  }

  const user = {
    id: foundUser._id,
    token: accessToken,
    profileImageUrl: foundUser.organisation,
    email: foundUser.email,
    name: foundUser.name,
    role: foundUser.role,
  };
  return res.status(200).json(user);
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json("un authorized");
    const { userId } = (await jwt.decode(token)) as TokenPayload;
    if (!userId) {
      return res.status(409).json({ message: "user id is required!!" });
    }
    const user = await userModel
      .findById(userId)
      .select("-password")
      .lean()
      .exec();
    if (!user)
      return res.status(404).json({ message: "there is no user with such id" });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error, ", error });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, name, email, password, profileImageUrl, role } = req.body;
    if (!userId)
      return res.status(404).json({ message: "user id is required!" });
    const user = await userModel
      .findById(userId)
      .select("-password")
      .lean()
      .exec();
    if (!user)
      return res
        .status(404)
        .json({ message: "there is no such user with this id" });
    let newName = user.name,
      newEmail = user.email,
      newProfileImageUrl = user.organisation,
      newRole = user.role,
      newPassword = null;
    if (name) {
      const foundUser = await userModel.findOne({ name }).lean().exec();
      if (foundUser)
        return res
          .status(409)
          .json({ message: "this name is already taken!!!" });
      newName = name;
    }
    if (email) {
      const foundUser = await userModel.findOne({ email }).lean().exec();
      if (foundUser)
        return res
          .status(409)
          .json({ message: "this email is already taken!!!" });
      newEmail = email;
    }
    if (profileImageUrl) newProfileImageUrl = profileImageUrl;
    if (role) newRole = role;
    if (password) {
      const hashPass = await bcrypt.hash(password, 10);
      newPassword = hashPass;
    }
    const newUser = await userModel.findByIdAndUpdate(userId, {
      name: newName,
      email: newEmail,
      profileImageUrl: newProfileImageUrl,
      role: newRole,
      password: newPassword,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "server error, ", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
   // console.log("refreshing")
    if (!req.cookies)
      return res.status(462).json({ messsage: "there is no cookies" });
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(462).json({ messsage: "there is no refresh token" });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "");
    //const payload = jwt.decode(token);

    const user = await userModel.findById((payload as TokenPayload).userId);
    if (!user){
      clearCookies(res);
       return res.status(401).json({ message: "invalid refresh token" });
    }
     
    const hashedtoken = crypto.createHash("sha256").update(token).digest("hex");

    // user.refreshTokens.forEach((r) =>
    //   console.log(r.token, " | ", hashedtoken, " = ", r.token === hashedtoken)
    // );
    const idx = user.refreshTokens.findIndex((rt) => rt.token === hashedtoken);
   // console.log("index of token ========",idx);
    
    if (idx === -1) {
      
      user.refreshTokens.splice(0, user.refreshTokens.length);
      await user.save();
    

  // Remove refresh cookie from client
  clearCookies(res);
      return res.status(403).json({ msg: "Reuse detected" });
    }
    user.refreshTokens.splice(idx, 1);
    const newRefreshToken = signRefreshToken(user);
    const newHashhedtoken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    user.refreshTokens.push({ token: newHashhedtoken, ip: req.ip });
    await user.save();
    const accessToken = signAccessToken(user);

    // Set new refresh cookie (replace previous)
    {
      const secure = process.env.NODE_ENV === "production";
      const cookieOpts: any = {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/",
        maxAge:
          Number(process.env.REFRESH_TOKEN_EXPIRES_IN_NUMBER) ||
          7 * 24 * 60 * 60 * 1000,
      };
      console.debug("Setting refresh cookie (refresh) opts:", cookieOpts);
      res.cookie("refreshToken", newRefreshToken, cookieOpts);
    }

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    clearCookies(res);
    return res.status(462).json({ message: "invalid refresh token" });
  }
};
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    // Remove this hashed token from all users (or current user)
    await userModel.updateOne(
      { "refreshTokens.token": hashed },
      { $pull: { refreshTokens: { token: hashed } } }
    );
  }

  
    const secure = process.env.NODE_ENV === "production";
    const clearOpts: any = {
      httpOnly: true,
      secure,
      sameSite: secure ? "none" : "lax",
      path: "/",
    };
    res.clearCookie("refreshToken", clearOpts);
  
  res.sendStatus(204);
};
const clearCookies=(res:Response)=>{
  const secure = process.env.NODE_ENV === "production";
    const clearOpts: any = {
      httpOnly: true,
      secure,
      sameSite: secure ? "none" : "lax",
      path: "/",
    };
    res.clearCookie("refreshToken", clearOpts);
}