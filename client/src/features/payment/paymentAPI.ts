import { apiClient } from "@/app/api-client";
import { PaymentResponse } from "./paymentType";

export const paymentApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createSubscriptionPayment: builder.mutation<PaymentResponse, {
      userId: string;
      plan: string;
      price: number;
      currency: string;
    }>({
      query: (body) => ({
        url: `/payment/create-subscription`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: PaymentResponse }) => response.data,
      invalidatesTags: ['billingSubscription'],
    }),

    cancelSubscription: builder.mutation<{message: string}, {
      orderId: string;
    }>({
      query: (body) => ({
        url: `/payment/cancel-subscription`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['billingSubscription'],
    }),
    
    cancelSubscription: builder.mutation<{message: string}, {
      orderId: string;
    }>({
      query: (body) => ({
        url: `/payment/cancel-subscription`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { message: string }) => response,
      invalidatesTags: ['billingSubscription'],
    }),
  }),
});

export const { useCreateSubscriptionPaymentMutation, useCancelSubscriptionMutation } = paymentApi;