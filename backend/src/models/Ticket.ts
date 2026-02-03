import mongoose, { Schema } from "mongoose";
import { CommentShema } from "./Comment.js";
const AssignedToSchema=new mongoose.Schema({
userId:{type: Schema.Types.ObjectId, ref: 'User',required:false},
date:{type:Date,required:false},
})
const TicketSchema=new mongoose.Schema({
    creator:{ type: Schema.Types.ObjectId, ref: 'User' },
    ref:{type:String,required:false},
    emitterOrganizationId:{ type: Schema.Types.ObjectId, ref: 'Organisation',required:true },
    recipientOrganizationId:{ type: Schema.Types.ObjectId, ref: 'Organisation',required:true },
    associatedOrganizations: [{ type: Schema.Types.ObjectId, ref: 'Organisation' }],
    formName:{type:String,required:true},
    status:{type:String,enum:["open","pending","traited","complete"],default:"pending"},
    priority:{type:String,enum:["low","medium","high"],default:"low"},
    motif:{type:String} ,
    //----
    pj:{type:String,required:false},
    message:{type:String,required:true},
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    specialFields : {type:Schema.Types.Mixed,required:false},
    updatedAt:{type:Date,default:new Date() },
    assignedTo:{type:AssignedToSchema, required:false},
    assignementHistory:{type:[AssignedToSchema],required:false},
    lastComment:{type:CommentShema,required:false},
    attachement:{type:String,required:false}

},{ timestamps: true });

TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ emitterOrganizationId: 1 });
TicketSchema.index({ recipientOrganizationId: 1 });
TicketSchema.index({ "assignedTo.userId": 1 });
TicketSchema.index({ createdAt: 1 });

const ticketModel=mongoose.model("Ticket",TicketSchema)
export default ticketModel;

