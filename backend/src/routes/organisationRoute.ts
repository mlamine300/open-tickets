import { Router } from "express";
import { addOrganisation, deleteOrganisation, getActiveOrganisations, getOrganisationById, getOrganisations, updateOrganisation } from "../controllers/organisationController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const organisationRouter=Router();

organisationRouter.get("/",protect,getActiveOrganisations);
organisationRouter.get("/:id",protect,getOrganisationById);
organisationRouter.post("/",protect,checkAdmin,addOrganisation)
organisationRouter.post("/list",protect,checkAdmin,getOrganisations)
organisationRouter.post("/:id",protect,checkAdmin,updateOrganisation)
organisationRouter.delete("/:id",protect,checkAdmin,deleteOrganisation)

export default organisationRouter;