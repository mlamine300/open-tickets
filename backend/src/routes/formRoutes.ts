import { Router } from "express";
import { addForm, getFormById, getForms } from "../controllers/formControllers.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const formRouter=Router();

formRouter.get("/",protect,getForms);

formRouter.get("/:id",protect,getFormById);
formRouter.post("/",protect,checkAdmin,addForm);

export default formRouter;
