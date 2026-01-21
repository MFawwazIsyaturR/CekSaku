import { apiClient } from "@/app/api-client";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    googleLogin: builder.mutation({
      query: (credentials: { code: string }) => ({ 
        url: "/auth/google",
        method: "POST",
        body: credentials, 
      }),
    }),

    githubLogin: builder.mutation({
      query: (credentials: { code: string }) => ({
        url: "/auth/github",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
     forgotPassword: builder.mutation({
      query: (credentials: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyResetToken: builder.mutation({
      query: (credentials: { token: string }) => ({
        url: "/auth/verify-reset-token",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials: { token: string; password: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
    sendRegistrationOTP: builder.mutation({
      query: (credentials: { email: string }) => ({
        url: "/auth/send-registration-otp",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyRegistrationOTP: builder.mutation({
      query: (credentials: { email: string; token: string }) => ({
        url: "/auth/verify-registration-otp",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useGithubLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation,
  useSendRegistrationOTPMutation,
  useVerifyRegistrationOTPMutation,
} = authApi;