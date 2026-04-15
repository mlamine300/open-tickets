import { NextFunction, Request, Response } from "express"

export const checkBiAPI=(req:Request,res:Response,next:NextFunction)=>{
try {
     const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.PBI_API_KEY) {
    
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
} catch (error) {
    console.log(error)
}
}