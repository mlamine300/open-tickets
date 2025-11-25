import { Router } from "express";
import {  addTicket, getMytickets, getTicketByid, getTickets } from "../controllers/ticketController.ts";
const ticketRouter=Router();

// ticketRouter.get("/",getTickets);
ticketRouter.get("/:id",getTicketByid);
ticketRouter.get("/list/:type",getTickets)
ticketRouter.get("/me",getMytickets);
ticketRouter.post("/",addTicket);


export default ticketRouter;