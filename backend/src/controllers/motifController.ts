import { Request, Response } from "express";
import motifModel from "../models/Motifs.js";

export const getMotifs=async(req:Request,res:Response)=>{
try {
    const motifs=await motifModel.find({}).exec();
    if(!motifs||motifs.length<1){
        return res.status(404).json({message:"there are no motifs in the database"});
    }
    return res.status(200).json({message:"success",data:motifs})
} catch (error) {
    return res.status(500).json({message:"server error :",error})
}
}
export const getActiveMotifs=async(req:Request,res:Response)=>{
try {
    const motifs=await motifModel.find({active:true}).exec();
    if(!motifs||motifs.length<1){
        return res.status(404).json({message:"there are no motifs in the database"});
    }
    return res.status(200).json({message:"success",data:motifs})
} catch (error) {
    return res.status(500).json({message:"server error :",error})
}
}
export const addMotif=async(req:Request,res:Response)=>{
    try {
       if(!req.body){
        return res.status(400).json({message:"fields are required"})
       } 
       const {name}=req.body;
       if(!name){
        return res.status(400).json({message:"name is required"})
       }
       const foundMotif=await motifModel.findOne({name}).lean();
       if(foundMotif){
        return res.status(409).json({message:"this motif name exist please make sure your not entering and existing organisation"})
       }
       const motif=await motifModel.create({
        name
       })
       if(motif._id)return res.status(200).json({message:"success",data:motif});
       return res.status(400).json({message:"Failed to created Organisation"});
    } catch (error) {
        return res.status(500).json({message:"server error",error})
    }
}

export const turnOffMotif=async(req:Request,res:Response)=>{
    try {
        const id=req.params.id;
        if(!id)return res.status(400).json({message:"id is required"});
        const foundMotif=await motifModel.findById(id).exec();
        if(!foundMotif)return res.status(404).json({message:"there is no motif with this id"});
         foundMotif.active=false;
       const x=await foundMotif.save();
       if(x._id)return res.status(200).json({message:"motif has been turn Off"})
       return res.status(400).json({message:"error turn off motif"}) 
    } catch (error) {
        console.log(error)
    }
}
export const turnOnMotif=async(req:Request,res:Response)=>{
    try {
        const id=req.params.id;
        if(!id)return res.status(400).json({message:"id is required"});
        const foundMotif=await motifModel.findById(id).exec();
        if(!foundMotif)return res.status(404).json({message:"there is no motif with this id"});
         foundMotif.active=true;
       const x=await foundMotif.save();
       if(x._id)return res.status(200).json({message:"motif has been turn Off"})
       return res.status(400).json({message:"error turn off motif"}) 
    } catch (error) {
        console.log(error)
    }
}