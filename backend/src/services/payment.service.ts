import { Env } from "../config/env.config";
import { midtransClientInstance } from "../config/midtrans.config";
import { BadRequestException } from "../utils/app-error";
import { UpdateUserParams, updateUser } from "./user.service";
import PaymentLogModel, { PaymentStatusEnum } from "../models/payment-log.model";

interface CreatePaymentParams {
  userId: string;
  plan: string;
  price: number;
  currency: string;
  customerDetails: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

interface PaymentNotificationPayload {
  transaction_id: string;
  order_id: string;
  payment_type: string;
  transaction_status: string;
  fraud_status?: string;
  status_code: string;
  gross_amount: string;
}

export const createSubscriptionPayment = async (params: CreatePaymentParams) => {
  const { userId, plan, price, currency, customerDetails } = params;

  // Generate a unique order ID
  const orderId = `SUB-${userId}-${Date.now()}`;

  // Create transaction details for Midtrans
  const transactionDetails = {
    // transaction_id: orderId,
    order_id: orderId,
    gross_amount: price,
  };

  // Create customer details
  const customerInfo = {
    first_name: customerDetails.first_name,
    last_name: customerDetails.last_name,
    email: customerDetails.email,
    phone: customerDetails.phone,
  };

  // Payment options
  const paymentPayload = {
    transaction_details: transactionDetails,
    customer_details: customerInfo,
    item_details: [
      {
        id: plan,
        price: price,
        quantity: 1,
        name: `${plan} Subscription`,
        brand: "CekSaku",
        category: "Subscription",
        merchant_name: "CekSaku",
      },
    ],
    callbacks: {
      finish: `${Env.FRONTEND_ORIGIN}/dashboard`,
      error: `${Env.FRONTEND_ORIGIN}/billing`,
      pending: `${Env.FRONTEND_ORIGIN}/billing`
    }
  };

  try {
    // Create the transaction using Midtrans
    const transaction = await midtransClientInstance.createTransaction(paymentPayload);

    // Create Payment Log
    await PaymentLogModel.create({
      userId,
      orderId,
      amount: price,
      plan,
      status: PaymentStatusEnum.UNPAID,
    });

    return {
      orderId: orderId,
      transactionId: orderId, // Kita bisa gunakan orderId sebagai referensi awal
      transactionStatus: 'pending', // Transaksi Snap selalu 'pending' saat dibuat
      paymentUrl: transaction.redirect_url || '', // URL jika Snap tidak bisa di-load
      token: transaction.token, // Ini adalah Snap Token yang dibutuhkan frontend
      grossAmount: price.toString(),
    };
  } catch (error: any) {
    console.error("Midtrans payment creation error:", error);
    // Log error details for debugging in sandbox
    if (error.api_response) {
      console.error("Midtrans API response:", error.api_response);
    }
    // Provide a more specific error message to the frontend
    throw new BadRequestException("Failed to create payment transaction. Please check your Midtrans configuration: " + error.message);
  }
};

export const cancelSubscription = async (orderId: string) => {
  try {
    // First, check the current status of the transaction from Midtrans
    const transactionStatus = await midtransClientInstance.transaction.status(orderId);

    console.log("Current transaction status from Midtrans:", transactionStatus);

    // If the transaction is still pending or active, we can cancel it through Midtrans
    if (transactionStatus.transaction_status === 'pending' ||
      transactionStatus.transaction_status === 'settlement' ||
      transactionStatus.transaction_status === 'capture') {

      // Cancel the transaction in Midtrans
      try {
        const cancelResult = await midtransClientInstance.transaction.cancel(orderId);
        console.log("Transaction cancelled in Midtrans:", cancelResult);
      } catch (cancelError) {
        console.warn("Midtrans cancel failed (might already be cancelled/expired):", cancelError);
      }
    }

    // Update user subscription status to cancelled
    await updateUserSubscription(orderId, 'cancelled', transactionStatus || {});

    // Update Payment Log status
    await PaymentLogModel.findOneAndUpdate(
      { orderId },
      { status: PaymentStatusEnum.UNPAID }
    );

    return {
      message: `Subscription with order ID ${orderId} has been cancelled`,
      cancelledOrderId: orderId
    };
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    // Check if this is a Midtrans-specific error
    if (error.message && (error.message.includes('not found') || error.message.includes('404'))) {
      // If the transaction doesn't exist in Midtrans, still update user status
      console.log(`Transaction ${orderId} not found in Midtrans, updating user status directly`);

      // We still want to update the user's subscription status even if Midtrans doesn't have the transaction
      await updateUserSubscription(orderId, 'cancelled', {
        item_details: [{ name: 'free' }],
        transaction_status: 'cancel'
      });

      return {
        message: `Subscription with order ID ${orderId} has been cancelled (not found in Midtrans)`,
        cancelledOrderId: orderId
      };
    }

    throw new BadRequestException(`Failed to cancel subscription: ${error.message}`);
  }
};

export const processTransactionStatus = async (orderId: string, transactionStatus: any) => {
  try {
    console.log(`Processing transaction status for ${orderId}:`, transactionStatus.transaction_status);

    // Process based on transaction status
    let paymentLogStatus = PaymentStatusEnum.PROCESSING;

    switch (transactionStatus.transaction_status) {
      case 'capture':
      case 'settlement':
        // Payment successful - update user subscription
        await updateUserSubscription(orderId, 'active', transactionStatus);
        paymentLogStatus = PaymentStatusEnum.SUCCESS;
        break;

      case 'cancel':
      case 'expire':
      case 'deny':
        // Payment failed or expired
        await updateUserSubscription(orderId, 'cancelled', transactionStatus);
        paymentLogStatus = PaymentStatusEnum.UNPAID;
        break;

      case 'pending':
        // Payment is pending
        await updateUserSubscription(orderId, 'pending', transactionStatus);
        paymentLogStatus = PaymentStatusEnum.PROCESSING;
        break;

      default:
        console.log(`Unhandled transaction status: ${transactionStatus.transaction_status}`);
        break;
    }

    // Update Payment Log
    const updatedLog = await PaymentLogModel.findOneAndUpdate(
      { orderId: orderId },
      {
        status: paymentLogStatus,
        paymentType: transactionStatus.payment_type
      },
      { new: true }
    );

    return updatedLog;
  } catch (error) {
    console.error("Error processing transaction status:", error);
    throw error;
  }
};

export const syncPaymentStatus = async (orderId: string) => {
  try {
    if (!orderId || orderId === "-") return null;

    // Get the latest status of the transaction from Midtrans
    const transactionStatus = await midtransClientInstance.transaction.status(orderId);
    return await processTransactionStatus(orderId, transactionStatus);
  } catch (error: any) {
    // If transaction not found in Midtrans, skip it
    if (error.message && (error.message.includes('not found') || error.message.includes('404'))) {
      console.warn(`Transaction ${orderId} not found in Midtrans during sync`);
      return null;
    }
    console.error(`Error syncing payment status for ${orderId}:`, error);
    return null;
  }
};

export const handlePaymentNotification = async (payload: PaymentNotificationPayload) => {
  try {
    // Get the latest status of the transaction from Midtrans
    const transactionStatus = await midtransClientInstance.transaction.status(payload.order_id);
    await processTransactionStatus(payload.order_id, transactionStatus);
  } catch (error) {
    console.error("Error handling payment notification:", error);
    throw new Error("Failed to handle payment notification");
  }
};

const updateUserSubscription = async (
  orderId: string,
  status: 'active' | 'cancelled' | 'pending',
  transactionData: any
) => {
  try {
    // Extract userId from order ID (SUB-userId-timestamp format)
    const userId = orderId.split('-')[1];

    if (!userId) {
      throw new Error(`Invalid order ID format: ${orderId}`);
    }

    // Update user subscription status in database
    // This is a simplified implementation - you may want to expand this based on your user model
    // Enhance payment type detection for bank transfers
    let paymentType = transactionData.payment_type;
    if (paymentType === 'bank_transfer' && transactionData.va_numbers?.[0]?.bank) {
      paymentType = `bank_transfer:${transactionData.va_numbers[0].bank}`;
    } else if (paymentType === 'echannel' && transactionData.bill_key) {
      paymentType = 'bank_transfer:mandiri';
    }

    const updateData: UpdateUserParams = {
      subscriptionStatus: status,
      subscriptionPlan: transactionData.item_details?.[0]?.name || 'Basic',
      subscriptionOrderId: orderId,
      subscriptionExpiredAt: status === 'active'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        : undefined,
      subscriptionPaymentType: paymentType,
    };

    await updateUser(userId, updateData);

    console.log(`User ${userId} subscription updated to ${status} for order ${orderId}`);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};