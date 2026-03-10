import mongoose from "mongoose"
import { boolean } from "zod";
const MotifSchema=new mongoose.Schema({
  name:{type:String, required:true},
  active:{type:boolean,default:true}
})
const motifModel=mongoose.model("motif",MotifSchema)
export default motifModel;
