import mongoose from "mongoose";

const usefulLinksSchema=new mongoose.Schema({
    
    name:{type:String,required:true},
    description:{type:String,required:false},
    link:{type:String,required:true},
    imageLink:{type:String,required:true},
    active:{type:Boolean,default:true}

},{timestamps:true})
export const usefulLinksModel=mongoose.model("UsefulLinks",usefulLinksSchema);