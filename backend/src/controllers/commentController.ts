import { Request, Response } from "express";
import ticketModel from "../models/Ticket.js";
import { commentsModel } from "../models/Comment.js";
import mongoose from "mongoose";
import { TokenPayload } from "../types/index.js";
import  jwt  from "jsonwebtoken";
export const addComment=async(req:Request,res:Response)=>{
    try {
        
         //checking auth
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(409).json({ message: "not autorized" });
        const { userId:authorId,organisation:emitterOrganizationId,activeStatus } = (await jwt.decode(token)) as TokenPayload;
        if (!authorId||!activeStatus) return res.status(400).json({message:"not authorized"})
          const ticketId=req.params.id;
         const message=req.body.message;
         const action=req.body.action||"other";
         if(!ticketId||!message)return res.status(400).json({message:"fields (message, ticketID) are required"})
            const ticket=await ticketModel.findById(ticketId);
        if(!ticket)return res.status(404).json({message:"tickets not found"});
            const comment=await commentsModel.create({authorId,ticketId,message,action});
        if(!comment||!comment._id){
            return res.status(400).json({message:"error adding comment"});
        }
         ticket.comments.push(comment._id);
         if(ticket.ref)comment.ticketRef=ticket.ref;
         ticket.lastComment=comment;
         await ticket.save();
         return res.status(200).json({message:"success",data:{ticket,comment}});
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error: adding comment to ticket",error})
    }
}
export const getCommentOfTicket=async(req:Request,res:Response)=>{
    try {
          const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(409).json({ message: "not autorized" });
        const { userId:authorId,organisation:emitterOrganizationId,activeStatus } = (await jwt.decode(token)) as TokenPayload;
        if (!authorId||!activeStatus) return res.status(400).json({message:"not authorized"})
            const id=req.params.id;
        if(!id)return res.status(404).json({message:"id is required"})
        // Ensure we match ObjectId (ticketId is stored as ObjectId in the Comment schema)
        const objectId = mongoose.Types.ObjectId;
        const comments=await commentsModel.aggregate([
            { $match: { ticketId: new mongoose.Types.ObjectId(id) } },
            // Join user (creator)
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            // Simplify author to single object (optional)
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        ]);
        if(!comments)return res.status(404).json({message:"there are no comments on this tickets"});
        return res.status(200).json({message:"success",data:comments});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error",error})

    }
}