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
}

export interface GetAdminStatsResponse {
  data: AdminStats;
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
    getAdminStats: builder.query<GetAdminStatsResponse, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ['Users', 'transactions' as any],
    }),
  }),
});

export const { useUpdateUserMutation, useDeleteUserMutation, useChangePasswordMutation, useGetUserProfileQuery, useGetUsersQuery, useGetAdminStatsQuery } = userApi;