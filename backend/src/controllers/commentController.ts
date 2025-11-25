import { Request, Response } from "express";
import ticketModel from "../models/Ticket.ts";
import { commentsModel } from "../models/Comment.ts";
import { TokenPayload } from "../types/index.ts";
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
         if(!ticketId||!message)return res.status(400).json({message:"fields (message, ticketID) are required"})
            const ticket=await ticketModel.findById(ticketId);
        if(!ticket)return res.status(404).json({message:"tickets not found"});
            const comment=await commentsModel.create({authorId,ticketId,message});
        if(!comment||!comment._id){
            return res.status(400).json({message:"error adding comment"});
        }
         ticket.comments.push(comment._id);
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
          const ticketId=req.params.id;
         const message=req.body.message;
         if(!ticketId||!message)return res.status(400).json({message:"fields (message, ticketID) are required"})
            const ticket=await ticketModel.findById(ticketId);
        if(!ticket)return res.status(404).json({message:"tickets not found"});
        const commentOnTicket=await commentsModel.find({ticketId}).lean().exec();
        if(!commentOnTicket||!Array.isArray(commentOnTicket)||!commentOnTicket.length)return res.status(200).json({message:"there are no comment on this ticket",data:[]})
        return res.status(200).json({message:"success",data:commentOnTicket});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error",error})

    }
}