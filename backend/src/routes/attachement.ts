import { Request, Response, Router } from "express";
import { configurationStorage } from "../middlewares/uploadMiddleware.js";

const attachementRouter=Router();
const multer = configurationStorage();
attachementRouter.post("/upload",

  multer.single("attachement"),
  (req: Request, res: Response) => {
   
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.file);
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    return res.status(200).json({ fileUrl });
  }
);

export default attachementRouter;