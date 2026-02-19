import { Router } from "express";
import { addOrganisation, deleteOrganisation, getAllOrganisations, getOrganisationById, getOrganisations, updateOrganisation } from "../controllers/organisationController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const organisationRouter=Router();

organisationRouter.get("/",protect,getAllOrganisations);
organisationRouter.get("/:id",protect,getOrganisationById);
organisationRouter.post("/",protect,checkAdmin,addOrganisation)
organisationRouter.post("/list",protect,checkAdmin,getOrganisations)
organisationRouter.put("/:id",protect,checkAdmin,updateOrganisation)
organisationRouter.delete("/:id",protect,checkAdmin,deleteOrganisation)

export default organisationRouter;