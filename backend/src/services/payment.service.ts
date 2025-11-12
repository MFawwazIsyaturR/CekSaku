import { midtransClientInstance } from "../config/midtrans.config";
import { BadRequestException } from "../utils/app-error";
import { UpdateUserParams, updateUser } from "./user.service";

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
    transaction_id: orderId,
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
  };

  try {
    // Create the transaction using Midtrans
    const transaction = await midtransClientInstance.charge(paymentPayload);
    
    return {
      orderId: transaction.order_id,
      transactionId: transaction.transaction_id,
      transactionStatus: transaction.transaction_status,
      paymentUrl: transaction.redirect_url,
      token: transaction.token_id,
      grossAmount: transaction.gross_amount,
    };
  } catch (error: any) {
    console.error("Midtrans payment creation error:", error);
    // Log error details for debugging in sandbox
    if (error.api_response) {
      console.error("Midtrans API response:", error.api_response);
    }
    throw new BadRequestException("Failed to create payment transaction: " + error.message);
  }
};

export const handlePaymentNotification = async (payload: PaymentNotificationPayload) => {
  try {
    // Get the latest status of the transaction from Midtrans
    const transactionStatus = await midtransClientInstance.transaction.status(payload.order_id);
    
    console.log("Transaction status from Midtrans:", transactionStatus);

    // Process based on transaction status
    switch (transactionStatus.transaction_status) {
      case 'capture':
      case 'settlement':
        // Payment successful - update user subscription
        await updateUserSubscription(payload.order_id, 'active', transactionStatus);
        break;
      
      case 'cancel':
      case 'expire':
        // Payment failed or expired
        await updateUserSubscription(payload.order_id, 'cancelled', transactionStatus);
        break;

      case 'pending':
        // Payment is pending
        await updateUserSubscription(payload.order_id, 'pending', transactionStatus);
        break;

      default:
        console.log(`Unhandled transaction status: ${transactionStatus.transaction_status}`);
        break;
    }
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
    const updateData: UpdateUserParams = {
      subscriptionStatus: status,
      subscriptionPlan: transactionData.item_details?.[0]?.name || 'Basic',
      subscriptionOrderId: orderId,
      subscriptionExpiredAt: status === 'active' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        : undefined,
    };

    await updateUser(userId, updateData);
    
    console.log(`User ${userId} subscription updated to ${status} for order ${orderId}`);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};