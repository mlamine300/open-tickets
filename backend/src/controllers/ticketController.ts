import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.ts";
import ticketModel from "../models/Ticket.ts";
import { ticket } from "../../../types/index.ts";
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
    const { userId,role,organisation,organisationsList,activeStatus } = (await jwt.decode(token)) as TokenPayload;
    if (!userId) return res.status(409).json({ message: "not autorized" });

    const maxPerPage=req.body?.maxPerPage||10
    const page=req.body?.page||1;
    let tickets:ticket[]=[];
    if(role==="standard"){
        tickets=await ticketModel.find({$or: [
    { emitterOrganizationId: organisation },
    { recipientOrganizationId: organisation }
  ]
})
    }
    else if(role==="supervisor") {
 tickets=await ticketModel.find({$or: [
    { emitterOrganizationId:{ $in: [organisation,...organisationsList] } },
    { recipientOrganizationId: { $in: [organisation,...organisationsList] }  },
    { associatedOrganizations: { $in: [organisation,...organisationsList] } },
  ]
}
)
    }
    else{
        tickets=await ticketModel.find({})
    }

    return res.status(200).json({message:"success",data:tickets})
}