import { Router } from "express";
import {  addTicket, getMytickets, getTicketByid, getTickets, takeTicketInCharge } from "../controllers/ticketController.ts";
const ticketRouter=Router();

// ticketRouter.get("/",getTickets);
//ticketRouter.get("/:id",getTicketByid);
ticketRouter.post("/list/:type",getTickets)
ticketRouter.put("/take_in_charge/:id",takeTicketInCharge)
ticketRouter.post("/me/:status",getMytickets);
ticketRouter.post("/",addTicket);


export default ticketRouter;