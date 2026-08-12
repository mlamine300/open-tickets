import { Request, Response } from 'express';
import jwt from "jsonwebtoken"
import { TokenPayload } from '../types/index.js';
import { navetteModel } from '../models/Navette.js';
import { endOfDay, startOfDay } from 'date-fns';
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

export const updateNavette = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'Navette updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Navette' });
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
           

             
                const navettes=await navetteModel.find(filter).sort({ arrivalTime: -1 }).skip(skip).limit(limit);;

                return res.status(200).json({message:"success",data:navettes})
            
            
   
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
            const navette=await navetteModel.findById(id);
            if(role==="admin"||navette?.organisation===organisation)return res.status(200).json({message:"success",data:navette});

             
           
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
            const { userId,userOrganisation,activeStatus,role } = (await jwt.decode(token)) as TokenPayload;
            if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
            
            let filter:any={   }
            
            if(role!=="admin")filter["organisation"]=userOrganisation
             
             
              const timeStart=req.body?.timeStart||null;
              const timeEnd=req.body?.timeEnd||null;
              const organisation=req.body?.organisation||null;
              if(organisation)filter["organisation"]=organisation;
              if(timeStart&&timeEnd){
                const timeStartDate=startOfDay(new Date(timeStart))
                const timeEndDate=endOfDay(new Date(timeEnd))
                if(!timeEndDate||!timeStartDate)return res.status(400).json({message:"Date Format is incorrect",timeStartDate,timeEndDate})
                filter["arrivalTime"]={
                $gte: timeStartDate,
                $lte: timeEndDate
                    }
                    console.log({timeStartDate,timeEndDate})
                             }
              


              const page=req.body?.page||1;
              const limit=req.body?.limit||10;
              const skip=(page-1)*limit;
            
             

             
         
                const navettes=await navetteModel.find(filter).sort({ arrivalTime: -1 }).skip(skip).limit(limit);

                return res.status(200).json({message:"success",data:navettes})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"impossible de trouver la navette"})
    }
}