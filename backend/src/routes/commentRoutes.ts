import { Router } from "express";
import { addComment, getCommentOfTicket } from "../controllers/commentController.ts";

const commentRouter=Router();
commentRouter.post("/:id",addComment);
commentRouter.get("/:id",getCommentOfTicket)

export default commentRouter;