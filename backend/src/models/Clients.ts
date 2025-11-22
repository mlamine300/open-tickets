import  {Schema,model} from "mongoose";

const ClientSchema=new Schema({
    name:{type:String,required:true},
    prefix_Tracking:String,
    Organisation:{type:Schema.Types.ObjectId,ref:"Organisation"}
})

const clientModel=model("Client",ClientSchema)

export default clientModel;