import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import UserModel from "../models/user.model";
import TransactionModel from "../models/transaction.model";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const query: any = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const users = await UserModel.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    res.status(HTTPSTATUS.OK).json({
        message: "Users fetched successfully",
        data: {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        },
    });
});

export const getGlobalStats = asyncHandler(async (req: Request, res: Response) => {
    const totalUsers = await UserModel.countDocuments();
    const totalTransactions = await TransactionModel.countDocuments();

    // Aggregate total transaction amount (assuming 'amount' field exists and is numeric)
    // Checking transaction model structure might be improved, but assuming standard field
    const transactionStats = await TransactionModel.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);

    const totalTransactionAmount = transactionStats.length > 0 ? transactionStats[0].totalAmount : 0;

    res.status(HTTPSTATUS.OK).json({
        message: "Global stats fetched successfully",
        data: {
            totalUsers,
            totalTransactions,
            totalTransactionAmount,
        },
    });
});
