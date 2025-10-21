import { apiClient } from "@/app/api-client";
import { UpdateUserResponse } from "./userType";
import { ChangePasswordType } from "@/../../backend/src/validators/user.validator";

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
  }),
});

export const { useUpdateUserMutation, useDeleteUserMutation, useChangePasswordMutation } = userApi;