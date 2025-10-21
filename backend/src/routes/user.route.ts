import { Router } from "express";
import {
  changePasswordController,
   deleteUserController,
  getCurrentUserController,
  updateUserController,
} from "../controllers/user.controller";
import { upload } from "../config/cloudinary.config";

const userRoutes = Router();

userRoutes.get("/current-user", getCurrentUserController);
userRoutes.put(
  "/update",
  upload.single("profilePicture"),
  updateUserController
);

userRoutes.delete("/delete", deleteUserController);

userRoutes.put("/change-password", changePasswordController);

export default userRoutes;
