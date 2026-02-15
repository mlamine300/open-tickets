import mongoose,{Schema} from "mongoose";
import { boolean } from "zod";
export const InfoShema=new mongoose.Schema({
    authorId:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
     isLatin:{type:boolean,default:true},
    message:{type:String,required:false},
    
},{timestamps:true})
export const infosModel=mongoose.model("Info",InfoShema);