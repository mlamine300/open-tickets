import { Request, Response } from "express";
import formulaireModel from "../models/Formulaire.js";
import { validateFieldSchema } from "../utils/index.js";
import ticketModel from "../models/Ticket.js";


export const getForms=async(req:Request,res:Response)=>{
   try {
    const list=await formulaireModel.find({active:true}).lean().exec();
    if(!list||list.length<1){
return res.status(404).json({message:"there are no forms in database"});

    }

    return res.status(200).json({message:"sucess",data:list})

   } catch (error) {
    return res.status(500).json({message:"Server Error",error})
   }
}

export const getFormById=async(req:Request,res:Response)=>{
try {
    const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    const form=await formulaireModel.findById(id).lean();
    if(!form){
        return res.status(404).json({message:"form not found"});
    }

    return res.status(200).json({message:"success",data:form})

} catch (error) {
    return res.status(500).json({message:"Server Error",error})
}
}

export const editFormById=async(req:Request,res:Response)=>{
try {
    const {id}=req.params;
    const formRequest=req.body;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    console.log({...formRequest});
    
    const form=await formulaireModel.findByIdAndUpdate(id,{...formRequest});
    if(!form){
        return res.status(404).json({message:"form not found"});
    }


    return res.status(200).json({message:"success",data:form})

} catch (error) {
    return res.status(500).json({message:"Server Error",error})
}
}

export const addForm=async(req:Request,res:Response)=>{
   try {
    
    
     if(!req.body)return res.status(400).json({message:"name and fields are required"});
    const {name,fields,description}=req.body;
    if(!name||!fields){
        return res.status(400).json({message:"name and fields are required"});
    }
    if(!Array.isArray(fields)||fields.length<1){
        return res.status(400).json({message:"field sould be an array whith a length of one or heigher"});  
    }
    const form=await formulaireModel.find({name}).lean().exec();
    if(form&&form.length>0)return res.status(409).json({message:"duplicate, this form already existe"})
    fields.forEach(f=>{
        if(!validateFieldSchema(f).valid){
            console.log(validateFieldSchema(f));
            
            return res.status(400).json({message:`error in field :${f.label||"label"}  ${validateFieldSchema(f).errors.at(0)}`})

        }
    })
        const data=await formulaireModel.create({name,description,fields})
        if(data)return res.status(200).json({message:"success",data})
            else return res.status(400).json({message:"error creating form"})
   } catch (error) {
    return res.status(500).json({message:"Server Error",error})
   }
}
export const deleteForm=async(req:Request,res:Response)=>{
    try {
         const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    const form=await formulaireModel.findById(id);
    if(!form){
        return res.status(404).json({message:"form not found"});
    }
    if(!form.active)return res.status(200).json({message:"no change",form})

      const tickets=await ticketModel.find({formName:form.name});
      if(tickets.length){
        return res.status(409).json({message:"delete is impossible there are some tickets with this form"});
      }  
    form.active=false;
    await form.save();
    return res.status(200).json({message:"success",form})
    } catch (error) {
        return res.status(500).json({message:"Server Error",error})
    }
}