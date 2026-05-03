
import { NextFunction, Request, Response } from "express";
import { logEvents } from "./logger.js";
import path from "path";
import fs from "fs";


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    const logDir = path.join(path.dirname(__dirname), "log");
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, "error.log");
    logEvents(
        `${err.name}:${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\t${JSON.stringify(req.body)}\t${JSON.stringify(req.params)}\n${JSON.stringify(err.stack)}\n`,
        logFile
    );
    console.log(err.stack);
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status);
    res.json({ message: err.message });
};
