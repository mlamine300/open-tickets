import mongoose, { Schema } from "mongoose";

const TicketSchema=new mongoose.Schema({
    creator:{ type: Schema.Types.ObjectId, ref: 'User' },
    emitterOrganizationId:{ type: Schema.Types.ObjectId, ref: 'Organisation',required:true },
    recipientOrganizationId:{ type: Schema.Types.ObjectId, ref: 'Organisation',required:true },
    associatedOrganizations: [{ type: Schema.Types.ObjectId, ref: 'Organisation' }],
    formName:{type:String,required:true},
    status:{type:String,enum:["open","pending","complete"],default:"open"},
    priority:{type:String,enum:["low","medium","high"],default:"low"},
    pj:{type:String,required:false},
    message:{type:String,required:true},
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    specialFields : {type:Schema.Types.Mixed,required:false},
    updatedAt:{type:Date,default:new Date() }
},{ timestamps: true });

const ticketModel=mongoose.model("Ticket",TicketSchema)
export default ticketModel;

