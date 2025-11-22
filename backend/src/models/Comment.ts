import mongoose,{Schema} from "mongoose";
const CommentShema=new mongoose.Schema({
    ticketId:{ type: Schema.Types.ObjectId, ref: 'Ticket',required:true },
    authorId:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
    message:{type:String,required:true}
},{timestamps:true})
export const commentsModel=mongoose.model("Comment",CommentShema);