import { Router } from "express";
import {
    getAllUsers,
    getGlobalStats,
    updateUser,
    deleteUser,
    getAllTransactions,
    getUserTransactions,
    adminDeleteTransaction,
} from "../controllers/admin.controller";
import { roleMiddleware } from "../middlewares/role.middleware";

const adminRoutes = Router();

// Apply admin role check to all routes in this router
adminRoutes.use(roleMiddleware("admin"));

adminRoutes.get("/users", getAllUsers);
adminRoutes.put("/users/:id", updateUser); // Update role
adminRoutes.delete("/users/:id", deleteUser); // Delete user

adminRoutes.get("/stats", getGlobalStats);
adminRoutes.get("/transactions", getAllTransactions); // Audit all
adminRoutes.delete("/transactions/:id", adminDeleteTransaction); // Delete transaction
adminRoutes.get("/users/:id/transactions", getUserTransactions); // Specific user

export default adminRoutes;
