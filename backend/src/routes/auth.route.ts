import { Router } from "express";
import {
  forgotPasswordController, // <-- Impor
  resetPasswordController,  // <-- Impor
  verifyResetTokenController,
  githubLoginController,
  googleLoginController,
  loginController,
  registerController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/google", googleLoginController);
authRoutes.post("/github", githubLoginController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.post("/verify-reset-token", verifyResetTokenController);
authRoutes.post("/reset-password", resetPasswordController);

export default authRoutes;