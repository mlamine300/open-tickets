import { Router } from "express";
import { addComment, addTicket, getTickets } from "../controllers/ticketController.ts";
const ticketRouter=Router();

ticketRouter.get("/",getTickets);
ticketRouter.post("/",addTicket);
ticketRouter.put("/:id/comment",addComment)

export default ticketRouter;