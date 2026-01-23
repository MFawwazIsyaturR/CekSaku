import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import UserModel from "../models/user.model";
import TransactionModel from "../models/transaction.model";
import PaymentLogModel, { PaymentStatusEnum } from "../models/payment-log.model";
import { syncPaymentStatus } from "../services/payment.service";

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

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Role is required",
        });
    }

    const user = await UserModel.findByIdAndUpdate(
        id,
        { role },
        { new: true }
    ).select("-password");

    if (!user) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "User not found",
        });
    }

    res.status(HTTPSTATUS.OK).json({
        message: "User updated successfully",
        data: user,
    });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "User not found",
        });
    }

    // Also delete user transactions
    await TransactionModel.deleteMany({ userId: id });

    res.status(HTTPSTATUS.OK).json({
        message: "User and their transactions deleted successfully",
    });
});

export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const query: any = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const transactions = await TransactionModel.find(query)
        .populate("userId", "name email")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await TransactionModel.countDocuments(query);

    res.status(HTTPSTATUS.OK).json({
        message: "Transactions fetched successfully",
        data: {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        },
    });
});

export const getUserTransactions = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const transactions = await TransactionModel.find({ userId: id })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await TransactionModel.countDocuments({ userId: id });

    res.status(HTTPSTATUS.OK).json({
        message: "User transactions fetched successfully",
        data: {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        },
    });
});

export const adminDeleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const transaction = await TransactionModel.findByIdAndDelete(id);

    if (!transaction) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "Transaction not found",
        });
    }

    res.status(HTTPSTATUS.OK).json({
        message: "Transaction deleted successfully",
    });
});

export const getGlobalStats = asyncHandler(async (req: Request, res: Response) => {
    const totalUsers = await UserModel.countDocuments();
    const totalTransactions = await TransactionModel.countDocuments();

    // Calculate Active Users (active in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await UserModel.countDocuments({
        updatedAt: { $gte: thirtyDaysAgo }
    });

    // Calculate Admin Count
    const adminCount = await UserModel.countDocuments({ role: "admin" });

    // Calculate Today's Transactions
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTransactions = await TransactionModel.countDocuments({
        createdAt: { $gte: startOfToday }
    });

    // Aggregate total transaction amount (assuming 'amount' field exists and is numeric)
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
            activeUsers,
            adminCount,
            todayTransactions,
        },
    });
});

export const getAllPaymentLogs = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    // We want to list all users and their latest payment log
    const pipeline: any[] = [
        {
            $match: {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ]
            }
        },
        {
            $lookup: {
                from: "paymentlogs",
                localField: "_id",
                foreignField: "userId",
                as: "logs"
            }
        },
        {
            $addFields: {
                latestLog: { $arrayElemAt: [{ $sortArray: { input: "$logs", sortBy: { createdAt: -1 } } }, 0] }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                latestLog: 1,
            }
        },
        { $sort: { "latestLog.createdAt": -1, name: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ];

    const usersWithLogs = await UserModel.aggregate(pipeline);

    // Automation: Sync any non-SUKSES status with Midtrans
    // We check both PROSES and BELUM DIBAYAR if there is a valid orderId
    usersWithLogs.forEach(user => {
        if (user.latestLog && user.latestLog.orderId !== "-" && user.latestLog.status !== PaymentStatusEnum.SUCCESS) {
            syncPaymentStatus(user.latestLog.orderId).catch(err =>
                console.error(`Background sync failed for ${user.latestLog.orderId}:`, err)
            );
        }
    });

    // Transform to match the expected PaymentLog structure
    const paymentLogs = usersWithLogs.map(user => {
        if (user.latestLog) {
            return {
                ...user.latestLog,
                userId: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } else {
            // Placeholder for users without logs
            return {
                _id: `user_${user._id}`, // unique ID for frontend
                userId: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                orderId: "-",
                amount: 0,
                plan: "-",
                status: PaymentStatusEnum.UNPAID,
                createdAt: user.createdAt || new Date(),
                isPlaceholder: true
            };
        }
    });

    const total = await UserModel.countDocuments({
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ]
    });

    res.status(HTTPSTATUS.OK).json({
        message: "Payment logs fetched successfully",
        data: {
            paymentLogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        },
    });
});

export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params; // This could be a PaymentLog ID or user_USERID
    const { status } = req.body;

    if (!Object.values(PaymentStatusEnum).includes(status)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid payment status",
        });
    }

    let paymentLog;
    if (id.startsWith("user_")) {
        const userId = id.replace("user_", "");
        // Create a new log if none exists, or update the latest one
        paymentLog = await PaymentLogModel.findOneAndUpdate(
            { userId },
            {
                status,
                // If creating new, these fields are required by schema
                $setOnInsert: {
                    orderId: `MANUAL_${Date.now()}`,
                    amount: 0,
                    plan: "MANUAL",
                    userId
                }
            },
            { new: true, upsert: true }
        ).populate("userId", "name email");
    } else {
        paymentLog = await PaymentLogModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("userId", "name email");
    }

    if (!paymentLog) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "Payment log not found",
        });
    }

    res.status(HTTPSTATUS.OK).json({
        message: "Payment status updated successfully",
        data: paymentLog,
    });
});


