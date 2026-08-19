import mongoose,{Schema} from "mongoose";

export const NavetteSchema=new mongoose.Schema({
    
    authorId:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
    organisation:{type:String,required:true},
    navetteRef:{type:String,required:false},
    arrivalTime:{type:Date,require:true},
    departureTime:{type:Date,require:true},
    attachement:{type:String,required:false},
    comment:{type:String,required:false}
},{timestamps:true})
export const navetteModel=mongoose.model("Navette",NavetteSchema);
