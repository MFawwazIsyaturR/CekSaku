import mongoose from "mongoose";
import BudgetModel from "../models/budget.model";
import TransactionModel from "../models/transaction.model";

export const setBudgetService = async (userId: string, category: string, amount: number) => {
  // Upsert: Update jika ada, Buat baru jika belum
  return await BudgetModel.findOneAndUpdate(
    { userId, category },
    { amount },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const getBudgetsWithUsageService = async (userId: string) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  // 1. Ambil semua budget user
  const budgets = await BudgetModel.find({ userId });

  if (budgets.length === 0) return [];

  // 2. Hitung pengeluaran (Expense) bulan ini per kategori
  const usageStats = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "EXPENSE",
        date: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: "$category", // Group by category name
        totalSpent: { $sum: "$amount" }, // Sum amount (in cents)
      },
    },
  ]);

  // 3. Gabungkan Data
  return budgets.map((b) => {
    // Cari data pengeluaran yang cocok dengan kategori budget
    const stat = usageStats.find((s) => s._id === b.category);
    
    // totalSpent dari aggregate masih dalam Cents, konversi ke Unit
    const spent = stat ? stat.totalSpent / 100 : 0;
    
    return {
      _id: b._id,
      category: b.category,
      limit: b.amount, // Getter model sudah mengonversi ke unit
      spent,
      remaining: b.amount - spent,
      percentage: Math.min((spent / b.amount) * 100, 100),
    };
  });
};

export const deleteBudgetService = async (userId: string, id: string) => {
  await BudgetModel.findOneAndDelete({ _id: id, userId });
};