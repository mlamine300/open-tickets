import { NextFunction, Request, Response } from "express";
import { logEvents } from "./logger.js";


export const errorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    logEvents(`${err.name}:${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\t${req.body}\t${req.params}\t${JSON.stringify(req.body)}\n${JSON.stringify(err.stack)}\n`,"errLog.log")
console.log(err.stack)
const status=req.statusCode ?res.statusCode:500;
res.status(status);
res.json({message:err.message})

}