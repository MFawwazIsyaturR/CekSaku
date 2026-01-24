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

export interface GrowthPoint {
  date: string;
  volume: number;
  count: number;
}

export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  activeUsers: number;
  adminCount: number;
  todayTransactions: number;
  trends: {
    users: number;
    transactions: number;
    volume: number;
  };
  growthData: GrowthPoint[];
  range: string;
}

export interface GetAdminStatsResponse {
  data: AdminStats;
}



export interface PaymentLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  orderId: string;
  amount: number;
  plan: string;
  status: 'BELUM DIBAYAR' | 'PROSES' | 'SUKSES';
  paymentType?: string;
  createdAt: string;
}

export interface GetPaymentLogsResponse {
  data: {
    paymentLogs: PaymentLog[];
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
    getAdminStats: builder.query<GetAdminStatsResponse, string | void>({
      query: (range) => ({
        url: "/admin/stats",
        method: "GET",
        params: { range: range || "7d" },
      }),
      providesTags: ['Users', 'transactions' as any],
    }),

    getAdminPaymentLogs: builder.query<GetPaymentLogsResponse, { page: number; limit: number; search: string }>({
      query: (params) => ({
        url: "/admin/payments",
        method: "GET",
        params,
      }),
      providesTags: ['payments' as any],
    }),
    adminUpdatePaymentStatus: builder.mutation<void, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/payments/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ['payments' as any],
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

  useGetAdminPaymentLogsQuery,
  useAdminUpdatePaymentStatusMutation
} = userApi;