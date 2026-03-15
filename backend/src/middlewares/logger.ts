import { randomUUID } from "crypto";
import { format } from "date-fns";
import { NextFunction, Request, Response } from "express";
import  fs from "fs"
import path from "path"
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fsPromises=fs.promises;

export const logEvents=async (message:string,logFileName:string)=>{
    const dateTime=`${format(new Date(),"yyyy-MM-dd\tHH:mm:ss")}`;
    const logItem=`${dateTime}\t${randomUUID()}\t${message}\n`
    try {
       if(!fs.existsSync(path.join(__dirname,"..","logs"))){
        await fsPromises.mkdir(path.join(__dirname,"..","logs"));
       }
       await fsPromises.appendFile(path.join(__dirname,"..","logs",logFileName),logItem)
    } catch (error) {
        console.log(error)
    }
}


export const logger=(req:Request,res:Response,next:NextFunction)=>{
 logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,"reqLog.log")   
 console.log(`${req.method}\t${req.url}\t${req.headers.origin}`)
next();
}