import express, { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { configurationStorage } from "../middlewares/uploadMiddleware.ts";
const multer = configurationStorage();

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", protect, getUserProfile);
authRouter.put("/profile", protect, updateUserProfile);
authRouter.post(
  "/upload-image",

  multer.single("profile_image"),
  (req: Request, res: Response) => {
    console.log("-----------------------------");
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.file);
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    return res.status(200).json({ imageUrl });
  }
);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
