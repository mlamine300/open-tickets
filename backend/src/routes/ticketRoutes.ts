import { Router } from "express";
import {  addOrganisation, addTicket, closeTicket, getMytickets, getNotCompleteReport, getTicketByid, getTicketReport, getTickets, getTicketsStatsForSideBar, relanceTicket, searchTickets, takeTicketInCharge, traitTicket,switchOrganisation } from "../controllers/ticketController.js";
const ticketRouter=Router();

// ticketRouter.get("/",getTickets);
ticketRouter.get("/:id",getTicketByid);
ticketRouter.post("/list/:type",getTickets)
ticketRouter.post("/take_in_charge/:id",takeTicketInCharge)
ticketRouter.post("/close/:id",closeTicket)
ticketRouter.post("/trait/:id",traitTicket)
ticketRouter.post("/relance/:id",relanceTicket)
ticketRouter.post("/me/:status",getMytickets);
ticketRouter.post("/",addTicket);
ticketRouter.post("/add_organisation/:id",addOrganisation);
ticketRouter.post("/switch_organisation/:id",switchOrganisation);
ticketRouter.get("/reports/notcomplete",getNotCompleteReport);
ticketRouter.post("/reports/date",getTicketReport);
ticketRouter.post("/stats",getTicketsStatsForSideBar)
ticketRouter.post("/search/list",searchTickets)

export default ticketRouter;