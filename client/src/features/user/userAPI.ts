import { apiClient } from "@/app/api-client";
import { UpdateUserResponse, User } from "./userType";
import { ChangePasswordType } from "@/../../backend/src/validators/user.validator";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface GetUsersResponse {
  data: {
    users: AdminUser[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalUsers: number;
    };
  };
}

export interface GetUsersParams {
  page: number;
  limit: number;
  search: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  activeUsers: number;
  adminCount: number;
  todayTransactions: number;
}

export interface GetAdminStatsResponse {
  data: AdminStats;
}

export interface AdminTransaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  amount: number;
  title: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
}

export interface GetTransactionsResponse {
  data: {
    transactions: AdminTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AdminUpdateUserParams {
  id: string;
  role: string;
}

export const userApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, FormData>({
      query: (formData) => ({
        url: "/user/update",
        method: "PUT",
        body: formData,
      }),
    }),

    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: "/user/delete",
        method: "DELETE",
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordType>({
      query: (body) => ({
        url: "/user/change-password",
        method: "PUT",
        body,
      }),
    }),
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ['UserProfile'],
    }),
    getUsers: builder.query<GetUsersResponse, GetUsersParams>({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params,
      }),
      providesTags: ['Users'],
    }),
    adminUpdateUser: builder.mutation<void, AdminUpdateUserParams>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    adminDeleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Users', 'transactions' as any],
    }),
    getAdminStats: builder.query<GetAdminStatsResponse, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ['Users', 'transactions' as any],
    }),
    getAdminAllTransactions: builder.query<GetTransactionsResponse, { page: number; limit: number; search: string }>({
      query: (params) => ({
        url: "/admin/transactions",
        method: "GET",
        params,
      }),
      providesTags: ['transactions' as any],
    }),
    getUserTransactions: builder.query<GetTransactionsResponse, { id: string; page: number; limit: number }>({
      query: ({ id, ...params }) => ({
        url: `/admin/users/${id}/transactions`,
        method: "GET",
        params,
      }),
      providesTags: ['transactions' as any],
    }),
    adminDeleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['transactions' as any],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useGetUsersQuery,
  useGetAdminStatsQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useGetAdminAllTransactionsQuery,
  useGetUserTransactionsQuery,
  useAdminDeleteTransactionMutation
} = userApi;