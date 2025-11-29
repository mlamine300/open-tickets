import { Router } from "express";
import {  addTicket, getMytickets, getTicketByid, getTickets } from "../controllers/ticketController.ts";
const ticketRouter=Router();

// ticketRouter.get("/",getTickets);
//ticketRouter.get("/:id",getTicketByid);
ticketRouter.post("/list/:type",getTickets)
ticketRouter.post("/me/:status",getMytickets);
ticketRouter.post("/",addTicket);


export default ticketRouter;