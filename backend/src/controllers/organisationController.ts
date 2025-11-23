import { Request, Response } from "express";
import organisationModel from "../models/Organisation.ts"

export const getOrganisations=async(req:Request,res:Response)=>{
try {
    const organisations=await organisationModel.find({}).exec();
    if(!organisations||organisations.length<1){
        return res.status(404).json({message:"there are no organisation in the database"});
    }
    return res.status(200).json({message:"success",data:organisations})
} catch (error) {
    return res.status(500).json({message:"server error :",error})
}
}

export const getOrganisationById=async(req:Request,res:Response)=>{
    try {
       const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    const organisation=await organisationModel.findById(id).lean();
    if(!organisation){
      return  res.status(404).json({
        message:"there is no organisation with such ID"
      })
    }

    return res.status(200).json({message:"success",data:organisation}) 
    } catch (error) {
        return res.status(500).json({message:"server error :",error})
    }
}

export const updateOrganisation=async(req:Request,res:Response)=>{
    try {
       const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    const organisation=await organisationModel.findById(id);
    if(!organisation){
      return  res.status(404).json({
        message:"there is no organisation with such ID"
      })
    }

    const {name,head,address,description}=req.body;
    if(name)organisation.name=name;
    if(head)organisation.head=head;
    if(address)organisation.address;
    if(description)organisation.description=description;
    await organisation.save();
    return res.status(200).json({message:"success",data:organisation}) 
    } catch (error) {
        return res.status(500).json({message:"server error :",error})
    }
}

export const addOrganisation=async(req:Request,res:Response)=>{
    try {
       if(!req.body){
        return res.status(400).json({message:"fields are required"})
       } 
       const {name,head,address,description}=req.body;
       if(!name||!head){
        return res.status(400).json({message:"name and head are required"})
       }
       const foundOrganisation=await organisationModel.findOne({name}).lean();
       if(foundOrganisation){
        return res.status(409).json({message:"this organisation name exist please make sure your not entering and existing organisation"})
       }
       const org=await organisationModel.create({
        name,
        head,
        address:address||"",
        description:description||""
       })
    } catch (error) {
        return res.status(500).json({message:"server error",error})
    }
}