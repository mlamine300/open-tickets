import mongoose from "mongoose"
const OrganisationSchema=new mongoose.Schema({
  name:{type:String, required:true},
  wilaya:{type:String, required:false},
  address:{type:String, required:false},
  phone:{type:String, required:false},
  head:{type:String,required:false},
  description:{type:String,required:false},
})
const organisationModel=mongoose.model("Organisation",OrganisationSchema)
export default organisationModel;
