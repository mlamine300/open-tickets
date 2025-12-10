import { Types } from "mongoose";
import organisationModel from "../models/Organisation.js";
import formulaireModel from "../models/Formulaire.js";
import { FormFieldType } from "../types/index.js";


export const validateFieldSchema=(input:any)=> {
  const errors = [];

  // Validate label
  if (typeof input.label !== "string" || input.label.trim() === "") {
    errors.push("label is required and must be a non-empty string.");
  }

  // Validate name
  if (typeof input.name !== "string" || input.name.trim() === "") {
    errors.push("name is required and must be a non-empty string.");
  }

  // Validate type
  const allowedTypes = ["text", "number", "select", "date","select","select-filter","select-multiple","list"];
  if (!allowedTypes.includes(input.type || "text")) {
    errors.push(`type must be one of: ${allowedTypes.join(", ")}.`);
  }

  // Validate possibleValues
  if (input.possibleValues !== undefined) {
    if (!Array.isArray(input.possibleValues)) {
      errors.push("possibleValues must be an array of strings.");
    } else if (!input.possibleValues.every((v:any) => typeof v === "string")) {
      errors.push("possibleValues must contain only strings.");
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
export const getOrganisationId:(t:string)=>Promise<Types.ObjectId|null>=async(name:string)=>{
try {
  const found=await organisationModel.findOne({name}).lean().exec();
  if(found)return found._id;
  return null;
} catch (error) {
  console.log(error);
  return null;
}
  

}

export const getOrganisationsId:(t:string[])=>Promise<Types.ObjectId[]|null>=async(t:string[])=>{
  try {
    const list=await organisationModel.find({name:{ $in:[...t] } }).lean().exec();
    if(list&&list.length){
      return list.map(l=>l._id);
    }

    return null;

  } catch (error) {
    console.log(error)
    return null;
  }
}

export const getFieldsFromFormName:(t:string)=>Promise<FormFieldType[]|null>=async(name:string)=>{
  try {
      const form=await formulaireModel.findOne({name}).lean().exec();
      if(!form||!form.fields||!Array.isArray(form.fields)||form.fields.length<1)return null;
      else return form.fields;

  } catch (error) {
    console.log(error)
    return null;
  }
}

 export const COMMENT_ACTIONS=["comment","in_charge","called","relancer","close"]

    export const COMMENT_ACTIONS_DICTIONNAIRE=
      {
      comment:"Commentaire",
  in_charge: "pris en charge",
  called: "le concerné a été appelé",
  relancer: "relancer",
  close:"traité"
}