import { Request, Response } from "express";
import organisationModel from "../models/Organisation.js"
import { checkToken } from "../utils/index.js";
import ticketModel from "../models/Ticket.js";
import mongoose from "mongoose";
import userModel from "../models/User.js";
 const MAX_PER_PAGE=10;
export const getAllOrganisations=async(req:Request,res:Response)=>{
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

export const getOrganisations=async(req:Request,res:Response)=>{
try {
    const maxPerPage =req.body.maxPerPage??MAX_PER_PAGE;

    const page=req.body.page??1;
    const search=req.body.search as string||"";
    const wilaya=req.body.wilaya as string ||"";
    const filterSearch= {name:{ $regex: search, $options: "i" }}
    const filterWilaya={wilaya:wilaya};
    let params:any={};
    if(search.length>1&&wilaya){
        params["$and"]=[filterSearch,filterWilaya];
    }
    else if(search.length>1)params=filterSearch;
    else if(wilaya)params=filterWilaya;
    
    console.log(params);

    const organisations=await organisationModel.find(params).skip((page-1)*maxPerPage).limit(maxPerPage);
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

    const {name,head,address,description,wilaya,phone}=req.body;
    if(name)organisation.name=name;
    if(head)organisation.head=head;
    if(address)organisation.address=address;
    if(description)organisation.description=description;
    if(wilaya)organisation.wilaya=wilaya;
    if(phone)organisation.phone=phone;
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
       const {name,head,address,description,phone,wilaya}=req.body;
       if(!name){
        return res.status(400).json({message:"name is required"})
       }
       const foundOrganisation=await organisationModel.findOne({name}).lean();
       if(foundOrganisation){
        return res.status(409).json({message:"this organisation name exist please make sure your not entering and existing organisation"})
       }
       const org=await organisationModel.create({
        name,
        head:head||"",
        address:address||"",
        description:description||"",
        wilaya:wilaya||"",
        phone:phone||"",
       })
       if(org._id)return res.status(200).json({message:"success",data:org});
       return res.status(400).json({message:"Failed to created Organisation"});
    } catch (error) {
        return res.status(500).json({message:"server error",error})
    }
}

export const deleteOrganisation=async(req:Request,res:Response)=>{
    try {
        const {token,user,message,status}=checkToken(req);
         if(status!==200)return res.status(status).json({message});
         if(user?.role!=="admin")return res.status(409).json({message:"You don't have permission"});
         const organisationId=req.params.id;
         if(!organisationId)return res.status(400).json({message:"Id is required to delete organisation"});
         const organisation=await organisationModel.findById(organisationId).lean().exec();
         if(!organisation||!organisation.name)return res.status(404).json({message:"there is no such organisation with this id"});
         const tickets=await ticketModel.find({$or: [
             { emitterOrganizationId: new mongoose.Types.ObjectId(organisationId) },
             { recipientOrganizationId: new mongoose.Types.ObjectId(organisationId) },
              { associatedOrganizations: { $in: [new mongoose.Types.ObjectId(organisationId)] } },
           ]
         }).lean().exec();
         if(tickets&&Array.isArray(tickets)&&tickets.length>0)return res.status(400).json({message:"there are ticket on this organisation you cannot delete it"});
         const users=await userModel.find({$or: [
             { organisation: new mongoose.Types.ObjectId(organisationId) },
            
              { organisationsList: { $in: [new mongoose.Types.ObjectId(organisationId)] } },
           ]
         });
         if(users&&Array.isArray(users)&&users.length>0){
            return res.status(400).json({message:"there are users attached on this organisation you cannot delete it"})
         }

         const org=await organisationModel.findByIdAndDelete(organisationId);
         if(org)return res.status(200).json({message:`organisation : ${org.name} has been deleted`});

         return res.status(400).json({message:"cannot delete organisation"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Error",error})
    }
}