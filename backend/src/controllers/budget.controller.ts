import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { setBudgetService, getBudgetsWithUsageService, deleteBudgetService } from "../services/budget.service";
import { z } from "zod";

const budgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().min(1),
});

export const setBudgetController = asyncHandler(async (req: Request, res: Response) => {
  const body = budgetSchema.parse(req.body);
  await setBudgetService(req.user?._id, body.category, body.amount);
  res.status(HTTPSTATUS.OK).json({ message: "Anggaran disimpan" });
});

export const getBudgetsController = asyncHandler(async (req: Request, res: Response) => {
  const data = await getBudgetsWithUsageService(req.user?._id);
  res.status(HTTPSTATUS.OK).json({ message: "Success", data });
});

export const deleteBudgetController = asyncHandler(async (req: Request, res: Response) => {
  await deleteBudgetService(req.user?._id, req.params.id);
  res.status(HTTPSTATUS.OK).json({ message: "Anggaran dihapus" });
});