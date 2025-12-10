import { Router } from "express";
import { addOrganisation, getOrganisationById, getOrganisations, updateOrganisation } from "../controllers/organisationController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const organisationRouter=Router();

organisationRouter.get("/",protect,getOrganisations);
organisationRouter.get("/:id",protect,getOrganisationById);
organisationRouter.post("/",protect,checkAdmin,addOrganisation)
organisationRouter.patch("/",protect,checkAdmin,updateOrganisation)

export default organisationRouter;