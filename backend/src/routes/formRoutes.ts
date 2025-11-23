import { Router } from "express";
import { addForm, getFormById, getForms } from "../controllers/formControllers.ts";
import { checkAdmin, protect } from "../middlewares/authMiddleware.ts";

const formRouter=Router();

formRouter.get("/",protect,getForms);

formRouter.get("/:id",protect,getFormById);
formRouter.post("/",protect,checkAdmin,addForm);

export default formRouter;
