import { Router } from "express";
import { getAllUsers, getGlobalStats } from "../controllers/admin.controller";
import { roleMiddleware } from "../middlewares/role.middleware";

const adminRoutes = Router();

// Apply admin role check to all routes in this router
adminRoutes.use(roleMiddleware("admin"));

adminRoutes.get("/users", getAllUsers);
adminRoutes.get("/stats", getGlobalStats);

export default adminRoutes;
