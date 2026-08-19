import { Request, Response } from 'express';
import jwt from "jsonwebtoken"
import { TokenPayload } from '../types/index.js';
import { navetteModel } from '../models/Navette.js';
import userModel from '../models/User.js';
import organisationModel from '../models/Organisation.js';
import { differenceInHours, endOfDay, format, parse, startOfDay } from 'date-fns';
import mongoose from 'mongoose';

const normalizeId = (value: any) => {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.toString();
};

const serializeNavette = async (navette: any) => {
  const authorId = normalizeId(navette?.authorId);
  const organisationId = normalizeId(navette?.organisation);

  const [author, organisation] = await Promise.all([
    authorId ? userModel.findById(authorId).select('name').lean() : null,
    organisationId ? organisationModel.findById(organisationId).select('name').lean() : null,
  ]);

  return {
    ...navette,
    id: normalizeId(navette?._id) ?? navette?.id,
    authorId,
    authorName: author?.name || 'Unknown author',
    organisationId,
    organisationName: organisation?.name || 'Unknown organisation',
    organisation: organisationId,
  };
};

export const createNavette = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not autorized" });
            const { userId,organisation,activeStatus } = (await jwt.decode(token)) as TokenPayload;
            if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
            
            //checking request format
            if(!req?.body)return res.status(400).json({message:"there are no fields in request body"})
            
            const {departureTime,arrivalTime,navetteRef,attachement}=req.body;

            if(!departureTime||!arrivalTime)return res.status(400).json({message:"departure time and arrival time are required for this request!!"});
            const departureTimeDate=new Date(departureTime);
            const arrivalTimeDate=new Date(arrivalTime);
            if(!departureTimeDate||!arrivalTimeDate||
                departureTimeDate.getFullYear()<2000||
                 departureTimeDate.getFullYear()>2100||
                  arrivalTimeDate.getFullYear()<2000||
                 arrivalTimeDate.getFullYear()>2100
                ){
                    return res.status(400).json({message:"departure time or arrival time are incorrect"});
                }
                const nav=await navetteModel.create({
                    departureTime:departureTimeDate,arrivalTime:arrivalTimeDate,
                    navetteRef,authorId:userId,organisation:organisation,attachement});

    return res.status(201).json({ message: 'Navette created successfully',data:nav });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create Navette' });
  }
};

export const updateNavette = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required for this request!!!"})
     const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not autorized" });
            const { role } = (await jwt.decode(token)) as TokenPayload;
            
    const foundNavette=await navetteModel.findById(id).exec();
    if(!foundNavette||!foundNavette._id)return res.status(404).json({message:"there is no navette with such id"})
    const createdAt=foundNavette.createdAt;
  if(differenceInHours(new Date(),createdAt)>=24&&role!=="admin"){
    return res.status(400).json({message:"too late to edit this navette, please contact admin"});
  }
    
      if(!req.body)return res.status(400).json({message:"please provide a data to update"})
    
      const arrivalTime=req.body.arrivalTime||null;
    const departureTime=req.body.departureTime||null;
    const attachement=req.body.attachement||null;
    const comment=req.body.comment||null;
    let data:any={};
    if(arrivalTime)data["arrivalTime"]=arrivalTime
    if(departureTime)data["departureTime"]=departureTime
    if(attachement)data["attachement"]=attachement
    if(comment)data["comment"]=comment
    
    if(Object.keys(data).length>0){
      const updatedNavette=await navetteModel.findByIdAndUpdate(id,data);
      return  res.status(200).json({ message: 'Navette updated successfully',data:updateNavette });
    }
    
   return res.status(400).json({message:"unable to edit navette"})
  } catch (error) {
    console.error(error);
  return  res.status(500).json({ error: 'Failed to update Navette' });
  }
};

export const deleteNavette = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'Navette deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete Navette' });
  }
};

export const getNavettes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not autorized" });
            const { userId,organisation,activeStatus,role } = (await jwt.decode(token)) as TokenPayload;
            if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
            
            //checking request format
            if(!req?.body)return res.status(400).json({message:"there are no fields in request body"})

                const page=req.body.page||1;
              const limit=req.body.limit||10;
              const skip=(page-1)*limit;


            const filter=role==="admin"?{}:{organisation   }

            const navettes = await navetteModel.find(filter).sort({ arrivalTime: -1 }).skip(skip).limit(limit).lean();
            const serializedNavettes = await Promise.all(navettes.map((navette) => serializeNavette(navette)));

            return res.status(200).json({message:"success",data:serializedNavettes})
            
            
   
  } catch (error) {
    console.error(error);
   return res.status(500).json({ error: 'Failed to fetch Navettes' });
  }
};

export const getNavetteById = async (req: Request, res: Response): Promise<Response> => {
  try {
 const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not autorized" });
            const { userId,organisation,activeStatus,role } = (await jwt.decode(token)) as TokenPayload;
            if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
            const id=req.params.id;
            if(!id)return res.status(400).json({message:"id is required for this request!!"});
            const navette=await navetteModel.findById(id).lean();
            if(!navette) return res.status(404).json({message:"Navette not found"});
            if(role==="admin"||navette?.organisation===organisation){
              const serializedNavette = await serializeNavette(navette);
              return res.status(200).json({message:"success",data:serializedNavette});
            }

             
           
   return res.status(409).json({message:"you have no right to fetch this navette"});
  } catch (error) {
    console.error(error);
   return res.status(500).json({ error: 'Failed to fetch Navette' });
  }
};

export const searchNavette=async (req:Request,res:Response):Promise<Response>=>{
    try {
     const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(409).json({ message: "not autorized" });
            const { userId,organisation:userOrganisation,activeStatus,role,organisationsList } = (await jwt.decode(token)) as TokenPayload;
            if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
            
            let filter:any={   }
            
            if(role==="standard")filter["organisation"]=userOrganisation
             else if(role==="supervisor"){
           filter["organisation"]={ $in: [userOrganisation,...organisationsList] }      
             }
             
              const timeStart=req.body?.timeStart||null;
              const timeEnd=req.body?.timeEnd||null;
              const organisation=req.body?.organisation||null;
              if(organisation)filter["organisation"]=organisation;
              if(timeStart&&timeEnd){
                console.log({timeStart,timeEnd})
                const timeStartDate=startOfDay(parse(timeStart,"yyyy-MM-dd",new Date()))
                const timeEndDate=endOfDay(parse(timeEnd,"yyyy-MM-dd",new Date()))
                
                if(!timeEndDate||!timeStartDate)return res.status(400).json({message:"Date Format is incorrect",timeStartDate,timeEndDate})
                filter["arrivalTime"]={
                $gte: timeStartDate,
                $lte: timeEndDate,
                    }
                   
                             }
              


              const page=req.body?.page||1;
              const limit=req.body?.limit||10;
              const skip=(page-1)*limit;
            
         console.log("---------------------------")    
console.log(filter)
  console.log("---------------------------")            
         
const navettes=await navetteModel.find(filter).sort({ arrivalTime: -1 }).skip(skip).limit(limit).lean();
                const serializedNavettes = await Promise.all(navettes.map((navette) => serializeNavette(navette)));

                return res.status(200).json({message:"success",data:serializedNavettes})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"impossible de trouver la navette"})
    }
}