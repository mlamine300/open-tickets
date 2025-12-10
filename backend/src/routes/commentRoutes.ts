import { Router } from "express";
import { addComment, getCommentOfTicket } from "../controllers/commentController.js";

const commentRouter=Router();
commentRouter.post("/:id",addComment);
commentRouter.get("/:id",getCommentOfTicket)

export default commentRouter;