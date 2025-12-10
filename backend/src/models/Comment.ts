import mongoose,{Schema} from "mongoose";
import { COMMENT_ACTIONS } from "../utils/index.js";
export const CommentShema=new mongoose.Schema({
    ticketId:{ type: Schema.Types.ObjectId, ref: 'Ticket',required:true },
    authorId:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
     ticketRef:{type:String,required:false},
    message:{type:String,required:true},
    action:{type:String,enum:[...COMMENT_ACTIONS],default:"comment"}
},{timestamps:true})
export const commentsModel=mongoose.model("Comment",CommentShema);
