import { Router } from "express";
import {  addTicket, closeTicket, getMytickets, getTickets, relanceTicket, takeTicketInCharge } from "../controllers/ticketController.ts";
const ticketRouter=Router();

// ticketRouter.get("/",getTickets);
//ticketRouter.get("/:id",getTicketByid);
ticketRouter.post("/list/:type",getTickets)
ticketRouter.post("/take_in_charge/:id",takeTicketInCharge)
ticketRouter.post("/close/:id",closeTicket)
ticketRouter.post("/relance/:id",relanceTicket)
ticketRouter.post("/me/:status",getMytickets);
ticketRouter.post("/",addTicket);


export default ticketRouter;