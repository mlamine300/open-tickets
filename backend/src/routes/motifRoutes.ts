import { Router } from "express";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import { addMotif, getMotifs,turnOffMotif, turnOnMotif } from "../controllers/motifController.js";

const motifRouter=Router();

motifRouter.get("/",protect,getMotifs);
motifRouter.post("/",protect,checkAdmin,addMotif)
motifRouter.post("/off/:id",protect,checkAdmin,turnOffMotif)
motifRouter.post("/on/:id",protect,checkAdmin,turnOnMotif)

export default motifRouter;