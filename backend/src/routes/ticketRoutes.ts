import { Router } from "express";
import {  addOrganisation, addTicket, closeTicket, getMytickets, getNotCompleteReport, getTicketByid, getTickets, relanceTicket, takeTicketInCharge } from "../controllers/ticketController.js";
const ticketRouter=Router();

// ticketRouter.get("/",getTickets);
ticketRouter.get("/:id",getTicketByid);
ticketRouter.post("/list/:type",getTickets)
ticketRouter.post("/take_in_charge/:id",takeTicketInCharge)
ticketRouter.post("/close/:id",closeTicket)
ticketRouter.post("/relance/:id",relanceTicket)
ticketRouter.post("/me/:status",getMytickets);
ticketRouter.post("/",addTicket);
ticketRouter.post("/add_organisation/:id",addOrganisation);
ticketRouter.get("/reports/notcomplete",getNotCompleteReport);


export default ticketRouter;