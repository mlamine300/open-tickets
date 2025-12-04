import mongoose from "mongoose";

const FieldSchema=new mongoose.Schema({
    label:{type:String,required:true},
    name:{type:String,required:true},
    type: { type: String, enum: ["text", "number","select","date","select-multiple","select-filter","list"], default: "text" },
    possibleValues:[{type:String}],
    required:{type:Boolean,default:false}
   
})
const FormulaireSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:false},
    fields:[FieldSchema]
})

 const formulaireModel=mongoose.model("Formulaire",FormulaireSchema);
export default formulaireModel;


