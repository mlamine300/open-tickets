import { Request, Response } from 'express';
import { usefulLinksModel } from '../models/UsefulLinks.js';

export const createUsefulLinks = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {

    const {name,link,imageLink,description}=req.body;
    if(!name||!link||!imageLink){
        return res.status(400).json({message:"please provide a name, a link and an image link"});
    }
    const foundLinkByName=await usefulLinksModel.find({name}).exec();
    if(foundLinkByName&&foundLinkByName.length>0)return res.status(204).json({message:"a usefulLink with this name already exist"});
   const foundLinkByLink=await usefulLinksModel.find({link}).exec();
    if(foundLinkByLink&&foundLinkByLink.length>0)return res.status(204).json({message:"a usefulLink with this link already exist"});
   
   
    const result=await usefulLinksModel.create({name,link,imageLink,description});
    if(result&&result._id)return res.status(201).json({ message: 'UsefulLinks created successfully',data:result });

   return res.status(400).json({message:"we could not create usefulLink"})
  } catch (error) {
    console.error(error);
   return res.status(500).json({ message: 'server error',error });
  }
};

export const updateUsefulLinks = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"});

    const foundUsefulLink=await usefulLinksModel.findById(id).exec();
    if(!foundUsefulLink) return res.status(404).json({message:"there is no usefulLink with such Id"})
        const {name,link,imageLink}=req.body;
    if(name){
        const foundLinkByName=await usefulLinksModel.find({name}).exec();
        const duplicateName=foundLinkByName.find(f=>f._id!==foundUsefulLink._id);
        if(duplicateName&&duplicateName._id)return res.status(204).json({message:"there is a usefulLink with this name"})
        foundUsefulLink.name=name;
    }
    if(link){
    const foundLinkByLink=await usefulLinksModel.find({link}).exec();
        const duplicateLink=foundLinkByLink.find(f=>f._id!==foundUsefulLink._id);
        if(duplicateLink&&duplicateLink._id)return res.status(204).json({message:"there is a usefulLink with this link"})
         foundUsefulLink.link=link;
    }
        
    if(imageLink)foundUsefulLink.imageLink=imageLink;
    const result=await foundUsefulLink.save();
   return res.status(200).json({ message: 'UsefulLinks updated successfully',data:result });
  } catch (error) {
    console.error(error);
   return res.status(500).json({ message: 'Failed to update UsefulLinks',error });
  }
};

export const deactivateUsefulLinks = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"});

    const foundUsefulLink=await usefulLinksModel.findById(id).exec();
    if(!foundUsefulLink) return res.status(404).json({message:"there is no usefulLink with such Id"})
        foundUsefulLink.active=false
        await foundUsefulLink.save();
    return res.status(200).json({ message: 'UsefulLinks desactivated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete UsefulLinks',error });
  }
};

export const deleteUsefulLinks = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"});

    const foundUsefulLink=await usefulLinksModel.findByIdAndDelete(id);
    if(!foundUsefulLink)return res.status(400).json({message:"there is no usefulLink with such id"});

    return res.status(200).json({ message: 'UsefulLinks desactivated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete UsefulLinks',error });
  }
};

export const getActiveUsefulLinkss = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const data=await usefulLinksModel.find({active:true}).lean().exec();
  return  res.status(200).json({ message:"success",data });
  } catch (error) {
    console.error(error);
  return  res.status(500).json({ message: 'Failed to fetch UsefulLinkss',error });
  }
};

export const fetchAllUsefulLinkss = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const data=await usefulLinksModel.find().lean().exec();
    return res.status(200).json({ message:"success",data });
  } catch (error) {
    console.error(error);
  return  res.status(500).json({ message: 'Failed to fetch UsefulLinkss',error });
  }
};

export const getUsefulLinksById = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
      const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"});

    const foundUsefulLink=await usefulLinksModel.findById(id).lean().exec();
    if(!foundUsefulLink) return res.status(404).json({message:"there is no usefulLink with such Id"})
        return res.status(200).json({message:"success",data:foundUsefulLink})
  } catch (error) {
    console.error(error);
   return res.status(500).json({ error: 'Failed to fetch UsefulLinks' });
  }
};