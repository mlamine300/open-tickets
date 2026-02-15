import { Router } from "express";
import { addInfo, getLastInfos, removeInfo } from "../controllers/infoController.js";

const infoRouter= Router();
infoRouter.get("",getLastInfos);
infoRouter.post("",addInfo);
infoRouter.delete("",removeInfo);

export default infoRouter;