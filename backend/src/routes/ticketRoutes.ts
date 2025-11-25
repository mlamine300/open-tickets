import { Router } from "express";
import {  addTicket, getTickets } from "../controllers/ticketController.ts";
const ticketRouter=Router();

ticketRouter.get("/",getTickets);
ticketRouter.post("/",addTicket);


export default ticketRouter;