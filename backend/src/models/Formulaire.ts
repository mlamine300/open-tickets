import mongoose from "mongoose";

const FieldSchema=new mongoose.Schema({
    label:{type:String,required:true},
    name:{type:String,required:true},
    type: { type: String, enum: ["text", "number","select","date"], default: "text" },
    possibleValues:[{type:String}]
   
})
const FormulaireSchema=new mongoose.Schema({
    name:{type:String,required:true},
    fields:[FieldSchema]
})