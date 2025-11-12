export interface PaymentResponse {
  orderId: string;
  transactionId: string;
  transactionStatus: string;
  paymentUrl: string;
  token: string;
  grossAmount: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  period: string;
}