import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.ts";
import ticketModel from "../models/Ticket.ts";
import { ticket, User } from "../../../types/index.ts";
import { getFieldsFromFormName, getOrganisationId, getOrganisationsId } from "../utils/index.ts";
import { commentsModel } from "../models/Comment.ts";
export const addTicket=async(req:Request,res:Response)=>{
   

   
    try {
        //checking auth
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(409).json({ message: "not autorized" });
        const { userId,organisation:emitterOrganizationId,activeStatus } = (await jwt.decode(token)) as TokenPayload;
        if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
        
        //checking request format
        if(!req?.body)return res.status(400).json({message:"there are no fields in request body"})
        const{organisationDest,organisationTag,formName,message}=req.body;
        if(!organisationDest||!organisationTag||!formName||!message){
            return res.status(400).json({message:"fields are required {recipientOrganizationId ,associatedOrganizations ,type and message}"});
        }
        //transform organisation data from name to id
        const recipientOrganizationId=await getOrganisationId(organisationDest as string);
        const associatedOrganizations=(organisationTag&& Array.isArray(organisationTag)&& organisationTag.length)? (await getOrganisationsId(organisationTag) ):[]
        //getting form custom fields and check if request match the form
        const fields=await getFieldsFromFormName(formName);
        const specialFields:any={};
        if(fields!==null){
            const bodyFields=Object.keys(req.body);
            //if there is a required field missing in the request return 400
            fields.forEach(f=>{
                if(f.required&&!bodyFields.includes(f.name)){
                    return res.status(400).json({message:`${f.name} is required`});
                }
                //add all custom fields in "specialFields" object
                specialFields[f.name]=req.body[f.name];
            })
        }
        
        //
        const priority=req.body?.priority?.toLowerCase()||"low";
        const commentsId:any[]=[];
       
        const ticket=await ticketModel.create({
           emitterOrganizationId, recipientOrganizationId,associatedOrganizations,formName,message,specialFields,priority,commentsId
        })
        return res.status(200).json({message:"success",data:ticket})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
}

export const getTickets=async(req:Request,res:Response)=>{
const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId,role,organisation,organisationsList,activeStatus }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });

    const maxPerPage:number=Number(req.body?.maxPerPage)||10
    const page:number=Number( req.body?.page)||1;
    const type=req.body?.type||"pending";
    const arggFromAcount=getResponsablitiesFilterFromRole(user)
    const arrgToAdd=getFilterFromType(type);
    let tickets=[];
    
    tickets=await ticketModel.find({...arggFromAcount,...arggFromAcount}).skip((page-1)*maxPerPage).limit(maxPerPage).lean().exec();
    

    return res.status(200).json({message:"success",data:tickets})
}

export const getTicketByid=async(req:Request,res:Response)=>{
   try {
     const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId,role,organisation,organisationsList,activeStatus }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id);
    if(!ticket)return res.status(404).json({message:"ticket not found"})
        return res.status(200).json({message:"success",data:ticket})
   } catch (error) {
    console.log(error);
    return res.status(500).json({message:"server error",error})
    
   }
}

export const getMytickets=async(req:Request,res:Response)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId,role,organisation,organisationsList,activeStatus }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });

    const maxPerPage:number=Number(req.body?.maxPerPage)||10
    const page:number=Number(req.body?.page)||1;
    const type=req.body?.type||"pending";
    const tickets=await ticketModel.find({creator:userId}).skip((page-1) * 10).limit(maxPerPage).lean().exec();
    if(!tickets||!Array.isArray(tickets)||!tickets.length){
        return res.status(200).json({message:"there are no ticket",data:[]})
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error",error})
        
    }
}

const getFilterFromType=(type:string)=>{

}

const getResponsablitiesFilterFromRole=(user:TokenPayload)=>{
    const {role,organisation}=user;
    const organisationsList=user.organisationsList||[];
    if(role==="standard"){
return{$or: [
    { emitterOrganizationId: organisation },
    { recipientOrganizationId: organisation }
  ]
}
    }
    else if(role==="supervisor"){
     return {$or: [
    { emitterOrganizationId:{ $in: [organisation,...organisationsList] } },
    { recipientOrganizationId: { $in: [organisation,...organisationsList] }  },
    { associatedOrganizations: { $in: [organisation,...organisationsList] } },
  ]
}   
    }
    else return {}

}

