import mongoose from "mongoose"
const OrganisationSchema=new mongoose.Schema({
  name:{type:String, required:true},
  head:{type:String, required:false},
  address:{type:String, required:false},
  description:{type:String, required:false},
})
const organisationModel=mongoose.model("Organisation",OrganisationSchema)
export default organisationModel;
