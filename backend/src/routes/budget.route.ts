import { Router } from "express";
import { setBudgetController, getBudgetsController, deleteBudgetController } from "../controllers/budget.controller";

const budgetRoutes = Router();
budgetRoutes.post("/", setBudgetController);
budgetRoutes.get("/", getBudgetsController);
budgetRoutes.delete("/:id", deleteBudgetController);

export default budgetRoutes;