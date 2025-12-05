import { apiClient } from "@/app/api-client";

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export const budgetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<{ data: Budget[] }, void>({
      query: () => "/budget",
      providesTags: ["budgets"],
    }),
    setBudget: builder.mutation<void, { category: string; amount: number }>({
      query: (body) => ({ url: "/budget", method: "POST", body }),
      invalidatesTags: ["budgets"],
    }),
    deleteBudget: builder.mutation<void, string>({
      query: (id) => ({ url: `/budget/${id}`, method: "DELETE" }),
      invalidatesTags: ["budgets"],
    }),
  }),
});

export const { useGetBudgetsQuery, useSetBudgetMutation, useDeleteBudgetMutation } = budgetApi;