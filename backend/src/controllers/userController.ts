import { Request,Response } from "express";
import userModel from "../models/User.js";
import { checkToken, getMissingKeys, validateEmail, validateName, validatePassword } from "../utils/index.js";
import organisationModel from "../models/Organisation.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export const getUsers=async(req:Request,res:Response)=>{
    try {
         const t= checkToken(req);
         if(t.status!==200)return res.status(t.status).json({message:t.message});
            const page=Number(req.body?.page)||1;
            const maxPerPage:number=Number(req.body?.maxPerPage)||10;
            const skip = (page - 1) * maxPerPage;
            const organisationId:string=req.body?.organisationId||null;
            const statusactiveStatus=Boolean(req.body?.activeStatus||"true");
            const role=req.body?.role;
            const search:string=req.body?.search||"";
            let filter:any={};
            if(organisationId)filter["organisation"]=organisationId;
            if(role)filter["role"]=role;
            if(!statusactiveStatus)filter["activeStatus"]=false;
            if(search)filter["name"]= { $regex: search, $options: "i" };
            console.log(filter);
            
            const users=await userModel.find(filter,{ role:1,email:1,name: 1, _id: 1,activeStatus:1,organisation:1,createdAt:1 }).skip(skip).limit(maxPerPage).populate("organisation","name").lean().exec();
            if(users)return res.status(200).json({message:"success",data:users});
            return res.status(404).json({message:"users not founds",data:[]})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error",error})
        
    }
}

export const getUserById=async(req:Request,res:Response)=>{
    try {
        const t= checkToken(req);
         if(t.status!==200)return res.status(t.status).json({message:t.message});

         const id=req.params.id;
         if(!id)return res.status(400).json({message:"user id is required!"});

         const user=await userModel.findById(id,{password:0}).populate("organisation","_id, name").populate({
        path: "organisationsList",
        select: "_id name",
      }).lean().exec();
         if(!user)return res.status(404).json({message:"there is no user with such id"});
         return res.status(200).json({message:"success",data:user});

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"server error",error})
}
}

export const addUser=async(req:Request,res:Response)=>{
    try {
        const t=checkToken(req);
        if(t.status!==200)return res.status(t.status).json({message:t.message});
        const  informations=req.body;
        const missingKeys=getMissingKeys(informations,["name","email","password","organisation","role"]);
        if(missingKeys&&missingKeys.length)return res.status(400).json({message:`${missingKeys.join(", ")} are required in the request`});
        const {name,email,password,organisation:organisationId,role}=informations;
        if(!validateEmail(email))return res.status(400).json("email format is invalid")
        if(!validateName(name))return res.status(400).json("name format is invalid")
         if(!validatePassword(password))return res.status(400).json("password format is invalid")
        if(role!=="standard"&&role!=="supervisor")return res.status(400).json("invalid role")
            const organisation=await organisationModel.findById(new mongoose.Types.ObjectId(organisationId)).lean().exec();
        if(!organisation)return res.status(400).json("invalid organisation id")
        const foundUser=await userModel.find({email}, { password: 0,refreshTokens:0 }).lean().exec();
    
    if(foundUser&&foundUser.length>0&&foundUser.at(0)?._id)return res.status(400).json({message:`user with this id ${foundUser.at(0)?._id} already exist`});
    const newUser=await userModel.create(informations);
    if(newUser._id)return res.status(200).json({message:"success",data:{name:newUser.name,
        email:newUser.email,_id:newUser._id,
        role:newUser.role,createdAt:newUser.createdAt,
        organisation:newUser.organisation,
        organisationsList:newUser.organisationsList
    }});
    return res.status(400).json({message:"user not created"})



    } catch (error) {
     console.log(error);
     return res.status(500).json({message:"server error",error});
        
    }
}

export const updateUser=async(req:Request,res:Response)=>{
    try {
        const t=checkToken(req);
        if(t.status!==200)return res.status(t.status).json({message:t.message});
        const id=req.params.id;
        if(!id)return res.status(400).json({message:"id is required"});
        if(t.user?.userId!==id&&t.user?.role!=="admin")return res.status(409).json({message:"not authorized (admin only)"});
        const foundUser=await userModel.findById(id);
        if(!foundUser)return res.status(404).json({message:"ther is no user with such id"});
        const {name,email,password,organisation,role,organisationsList}=req.body;
        
        if(email){
            const emailUser=await userModel.findOne({email})
           
            if(!emailUser||(emailUser._id!==foundUser._id&&t.user.role!=="admin"))return res.status(409).json({message:"you don't have permission"});
            if(!validateEmail(email))return res.status(400).json({message:"this email is invalid"});
            foundUser.email=email;
        }
        if(name){
            if(!validateName(name))return res.status(400).json({message:"this name is invalid"});
            foundUser.name=name;
        }if(password){
            if(!validatePassword(password))return res.status(400).json({message:"this password is invalid"});
            const hashedPassword = await bcrypt.hash(password, 10);
            foundUser.password=hashedPassword;
            foundUser.refreshTokens.splice(0,0)
        }
        if(role){
            if(role!="standard"&&role!="supervisor")return res.status(400).json({message:"invalid role"});
            foundUser.role=role;
        }
        if(organisation){
           const foundOrganisation=await organisationModel.findById(organisation);
           if(!foundOrganisation) return res.status(400).json({message:"invalid organisation id"});
           foundUser.organisation=organisation;
        }
      
        if(organisationsList&&Array.isArray(organisationsList)&&organisationsList.length){
           
            const foundOrganisations=await organisationModel.find({_id: { $in: [...organisationsList] }});
            if(!foundOrganisations||foundOrganisations.length<organisationsList.length)
            {

                return res.status(400).json({message:"incorrect organisations list"})
            }
            const x=organisationsList.map(o=>new mongoose.Types.ObjectId(o));
                foundUser.organisationsList=x;
                console.log(foundUser.organisationsList)
            }
        await foundUser.save();
        return res.status(200).json({message:"success",data:{foundUser,password:null,refreshToken:null}});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error",error})
        
    }
}
export const deleteUser=async(req:Request,res:Response)=>{
    try {
         const t=checkToken(req);
        if(t.status!==200)return res.status(t.status).json({message:t.message});
        const id=req.params.id;
        if(!id)return res.status(400).json({message:"id is required"});
        if(t.user?.role!=="admin")return res.status(409).json({message:"not authorized (admin only)"});
        const foundUser=await userModel.findById(id);
        if(!foundUser)return res.status(404).json({message:"ther is no user with such id"});
        foundUser.activeStatus=false;
        await foundUser.save();
        return res.status(200).json({message:"success"});
    } catch (error) {
       console.log(error);
       return res.status(500).json({message:"server error",error})
        
    }
}
