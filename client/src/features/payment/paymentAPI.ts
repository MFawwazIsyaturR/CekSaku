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
  }),
});

export const { useCreateSubscriptionPaymentMutation } = paymentApi;