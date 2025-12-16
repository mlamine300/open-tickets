import { Router } from "express";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";
import { addUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController.js";

const userRouter=Router();
userRouter.post("/",getUsers);
userRouter.get("/:id",getUserById);
userRouter.post("/",checkAdmin,addUser);
userRouter.patch("/:id",checkAdmin,updateUser);
userRouter.delete("/:id",checkAdmin,deleteUser);

export default userRouter;