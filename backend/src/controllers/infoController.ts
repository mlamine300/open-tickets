import { Request,Response } from "express";
import { TokenPayload } from "../types/index.js";
import jwt from "jsonwebtoken"
import { infosModel } from "../models/info.js";
export const addInfo=async(req:Request,res:Response)=>{
    try {
       
        const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not authorized" });
        
            const user = jwt.decode(token) as TokenPayload;
            if (!user?.userId) return res.status(409).json({ message: "not authorized" });
        
            const authorId = user.userId;
            const isLatin=req.body.isLatin??true;
            const message=req.body.message??"";
            if(!message)return res.status(400).json({message:"Message is required To add an info"});
            const info=await infosModel.insertOne({message,isLatin,authorId})
            if(info._id)return res.status(200).json({message:"success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server Error"});
    }
}

export const getLastInfos=async(req:Request,res:Response)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not authorized" });
        
            const user = jwt.decode(token) as TokenPayload;
            if (!user?.userId) return res.status(409).json({ message: "not authorized" });
        const info=await (await infosModel.find({}).sort({createdAt: -1}).limit(1))
        if(!info||!Array.isArray(info)||info.length<1)return res.status(200).json({message:"there is no infos"});
        return res.status(200).json({message:"success",data:info.at(0)});
    } catch (error) {
        console.log(error); 
        res.status(500).json({message:"server error"})
    }
}

export const removeInfo=async(req:Request,res:Response)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not authorized" });
        
            const user = jwt.decode(token) as TokenPayload;
            if (!user?.userId) return res.status(409).json({ message: "not authorized" });
        
            const authorId = user.userId;

            
            const info=await infosModel.insertOne({message:"",isLatin:true,authorId})
            if(info._id)return res.status(200).json({message:"success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server Error"});
    }
}