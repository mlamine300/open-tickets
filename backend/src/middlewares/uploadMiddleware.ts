import { Request } from "express";
import multer from "multer";
const storage = multer.diskStorage({
  destination: (
    _: Request,
    __: Express.Multer.File,
    callback: CallableFunction
  ) => {
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    const now = new Date();
    console.log(`${now.getTime()}-${file.originalname}`);
    callback(null, `${now.getTime()}-${file.originalname}`);
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  callback: CallableFunction
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
    return callback(new Error("Only image files are allowed"), false);
  callback(null, true);
};
export const configurationStorage = () => multer({ storage, fileFilter });
