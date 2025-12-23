import { Router } from "express";
import { getDashboardStats } from "../controllers/ticketController.js";

const statRouter=Router();
statRouter.get("/status",getDashboardStats)

export default statRouter;