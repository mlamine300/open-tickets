import { Router } from "express";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import { addMotif, getActiveMotifs, getMotifs,turnOffMotif, turnOnMotif } from "../controllers/motifController.js";

const motifRouter=Router();

motifRouter.get("/",protect,getMotifs);
motifRouter.get("/active/",protect,getActiveMotifs);
motifRouter.post("/",protect,checkAdmin,addMotif)
motifRouter.post("/off/:id",protect,checkAdmin,turnOffMotif)
motifRouter.post("/on/:id",protect,checkAdmin,turnOnMotif)

export default motifRouter;