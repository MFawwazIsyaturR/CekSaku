import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { createSubscriptionPayment, handlePaymentNotification } from "../services/payment.service";
import { BadRequestException, InternalServerErrorException } from "../utils/app-error";

export const createSubscriptionPaymentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, plan, price, currency = "IDR" } = req.body;

    if (!userId || !plan || !price) {
      throw new BadRequestException("User ID, plan, and price are required");
    }

    const paymentData = await createSubscriptionPayment({
      userId,
      plan,
      price,
      currency,
      customerDetails: {
        first_name: req.user?.name?.split(' ')[0] || '',
        last_name: req.user?.name?.split(' ')[1] || '',
        email: req.user?.email || '',
        phone: '',
      }
    });

    res.status(HTTPSTATUS.OK).json({
      message: "Payment created successfully",
      data: paymentData,
    });
  }
);

export const handlePaymentNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await handlePaymentNotification(req.body);
      
      res.status(HTTPSTATUS.OK).json({
        message: "Notification handled successfully",
      });
    } catch (error) {
      console.error("Payment notification error:", error);
      res.status(HTTPSTATUS.OK).json({
        status: "failed",
      });
    }
  }
);