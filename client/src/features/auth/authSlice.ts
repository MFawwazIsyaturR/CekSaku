import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  user: User | null;
  reportSetting: ReportSetting | null;
}

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  profilePicture: string;
  isEmailVerified?: boolean;
  subscriptionStatus?: 'active' | 'cancelled' | 'pending' | 'expired';
  subscriptionPlan?: string;
  subscriptionOrderId?: string;
  subscriptionExpiredAt?: string | Date | null;
  subscriptionPaymentType?: string;
  role?: "user" | "admin";
}

interface ReportSetting {
  userId: string;
  frequency?: string;
  isEnabled: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  expiresAt: null,
  user: null,
  reportSetting: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
      let user = action.payload.user;
      if (user && user._id && !user.id) {
        user = { ...user, id: user._id };
      }
      state.user = user;
      state.reportSetting = action.payload.reportSetting;
    },
    updateCredentials: (state, action) => {
      const { accessToken, expiresAt, user: incomingUser, reportSetting } = action.payload;

      if (accessToken !== undefined) state.accessToken = accessToken;
      if (expiresAt !== undefined) state.expiresAt = expiresAt;
      if (incomingUser !== undefined) {
        let userToUpdate = incomingUser;
        if (userToUpdate._id && !userToUpdate.id) {
          userToUpdate = { ...userToUpdate, id: userToUpdate._id };
        }
        state.user = { ...(state.user as any), ...userToUpdate };
      }
      if (reportSetting !== undefined)
        state.reportSetting = { ...(state.reportSetting as any), ...reportSetting };
    },
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
      state.reportSetting = null;
    },
  },
});

export const { setCredentials, updateCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
