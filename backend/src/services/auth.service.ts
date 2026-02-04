import mongoose from "mongoose";
import UserModel from "../models/user.model";
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import { calculateNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { Env } from "../config/env.config";
import axios from "axios";
import { sendPasswordResetEmail, sendRegistrationVerificationEmail } from "../mailers/mailer";
import crypto from "crypto";
import PasswordResetTokenModel from "../models/password-reset-token.model";
import RegistrationOTPModel from "../models/registration-otp.model";
import bcrypt from 'bcrypt';


const googleClient = new OAuth2Client({
  clientId: Env.GOOGLE_CLIENT_ID,
  clientSecret: Env.GOOGLE_CLIENT_SECRET,
  redirectUri: Env.GOOGLE_REDIRECT_URI,
});

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;
  const session = await mongoose.startSession();
  let userResponse;

  try {
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) throw new UnauthorizedException("User already exists");

      // Create user with email verification status set to false initially
      const newUser = new UserModel({
        ...body,
        isEmailVerified: false // User starts as unverified
      });
      await newUser.save({ session });

      const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calculateNextReportDate(ReportFrequencyEnum.MONTHLY),
        lastSentDate: null,
      });
      await reportSetting.save({ session });

      userResponse = { user: newUser.omitPassword() };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }

  // Send registration verification OTP after successful registration (outside transaction)
  try {
    await sendRegistrationOTPService(email);
  } catch (error) {
    // Log the error but don't throw it, so registration still succeeds even if email fails
    console.error('Failed to send registration OTP:', error);
  }

  return userResponse;
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("Email/password not found");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new UnauthorizedException("Invalid email/password");

  // Check if user has verified their email
  if (!user.isEmailVerified) {
    throw new UnauthorizedException("Please verify your email address before logging in");
  }

  // Initialize quota for existing users if missing
  if (user.aiScanQuota === undefined) {
    user.aiScanQuota = 10;
    await user.save();
  }

  const { token, expiresAt } = signJwtToken({ userId: user.id });
  const reportSetting = await ReportSettingModel.findOne(
    { userId: user.id },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
    reportSetting,
  };
};

export const googleLoginService = async (code: string) => {
  try {
    const { tokens } = await googleClient.getToken(code);
    if (!tokens || !tokens.id_token) {
      throw new UnauthorizedException("Google login failed: Invalid token response.");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: Env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      throw new UnauthorizedException("Google login failed: Invalid payload.");
    }

    const { email, name, picture } = payload;
    let user = await UserModel.findOne({ email });

    if (!user) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const newUser = new UserModel({
            email,
            name,
            profilePicture: picture,
            password: Math.random().toString(36).slice(-8),
          });
          await newUser.save({ session });

          const reportSetting = new ReportSettingModel({
            userId: newUser._id,
            frequency: ReportFrequencyEnum.MONTHLY,
            isEnabled: true,
            // FIX: Tambahkan argumen frekuensi
            nextReportDate: calculateNextReportDate(ReportFrequencyEnum.MONTHLY),
            lastSentDate: null,
          });
          await reportSetting.save({ session });

          user = newUser;
        });
      } finally {
        session.endSession();
      }
    }

    if (!user) {
      throw new InternalServerErrorException("Failed to create or find user.");
    }

    const { token, expiresAt } = signJwtToken({ userId: user.id });

    // Initialize quota for existing users if missing
    if (user.aiScanQuota === undefined) {
      user.aiScanQuota = 10;
      await user.save();
    }

    const reportSetting = await ReportSettingModel.findOne(
      { userId: user.id },
      { _id: 1, frequency: 1, isEnabled: 1 }
    ).lean();

    return {
      user: user.omitPassword(),
      accessToken: token,
      expiresAt,
      reportSetting,
    };
  } catch (error) {
    console.error("Google Login Service Error:", error);
    throw new UnauthorizedException("Failed to login with Google.");
  }
};

export const githubLoginService = async (code: string) => {
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: Env.GITHUB_CLIENT_ID,
        client_secret: Env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new UnauthorizedException("Failed to get GitHub access token.");
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { name, avatar_url } = userResponse.data;
    let { email } = userResponse.data;

    if (!email) {
      const emailsResponse = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = emailsResponse.data.find((e: any) => e.primary)?.email;
      if (!primaryEmail) throw new UnauthorizedException("GitHub account has no public email.");
      email = primaryEmail;
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const newUser = new UserModel({
            email: email,
            name: name || userResponse.data.login,
            profilePicture: avatar_url,
            password: Math.random().toString(36).slice(-8),
          });
          await newUser.save({ session });

          const reportSetting = new ReportSettingModel({
            userId: newUser._id,
            frequency: ReportFrequencyEnum.MONTHLY,
            isEnabled: true,
            // FIX: Tambahkan argumen frekuensi
            nextReportDate: calculateNextReportDate(ReportFrequencyEnum.MONTHLY),
            lastSentDate: null,
          });
          await reportSetting.save({ session });

          user = newUser;
        });
      } finally {
        session.endSession();
      }
    }

    if (!user) {
      throw new InternalServerErrorException("Failed to create or find user.");
    }

    const { token, expiresAt } = signJwtToken({ userId: user.id });

    // Initialize quota for existing users if missing
    if (user.aiScanQuota === undefined) {
      user.aiScanQuota = 10;
      await user.save();
    }

    const reportSetting = await ReportSettingModel.findOne({ userId: user.id }).lean();

    return {
      user: user.omitPassword(),
      accessToken: token,
      expiresAt,
      reportSetting,
    };
  } catch (error) {
    console.error("GitHub Login Service Error:", error);
    throw new UnauthorizedException("Failed to login with GitHub.");
  }
};

export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { message: "If a user with that email exists, a reset link has been sent." };
  }
  await PasswordResetTokenModel.deleteOne({ userId: user._id });
  const resetToken = crypto.randomInt(100000, 999999).toString();
  const expiration = new Date(Date.now() + 15 * 60 * 1000);

  await new PasswordResetTokenModel({
    userId: user._id,
    token: resetToken,
    expiresAt: expiration,
  }).save();

  await sendPasswordResetEmail(user.email, user.name, resetToken);
  return { message: "Password reset email sent." };
};

export const verifyResetTokenService = async (token: string) => {
  const records = await PasswordResetTokenModel.find({ expiresAt: { $gt: new Date() } });
  for (const record of records) {
    const isValid = await bcrypt.compare(token, record.token);
    if (isValid) return { valid: true };
  }
  throw new UnauthorizedException("Invalid or expired password reset token.");
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  const records = await PasswordResetTokenModel.find({ expiresAt: { $gt: new Date() } });
  let validRecord = null;
  for (const record of records) {
    if (await bcrypt.compare(token, record.token)) {
      validRecord = record;
      break;
    }
  }
  if (!validRecord) {
    throw new UnauthorizedException("Invalid or expired password reset token.");
  }
  const user = await UserModel.findById(validRecord.userId);
  if (!user) {
    throw new NotFoundException("User not found.");
  }
  user.password = newPassword;
  await user.save();
  await PasswordResetTokenModel.findByIdAndDelete(validRecord._id);
  return { message: "Password has been reset successfully." };
};

export const refreshTokenService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  // Initialize quota for existing users if missing
  if (user.aiScanQuota === undefined) {
    user.aiScanQuota = 10;
    await user.save();
  }

  const reportSetting = await ReportSettingModel.findOne(
    { userId: user.id },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
    reportSetting,
  };
};

export const logoutService = async (userId: string) => {
  // In a real application, you might want to implement token blacklisting
  // For now, we'll just return a success message
  return { message: "User logged out successfully" };
};

export const sendRegistrationOTPService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  // Delete any existing unverified OTP for this user
  await RegistrationOTPModel.deleteMany({
    userId: user._id,
    isVerified: false
  });

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiration = new Date(Date.now() + 15 * 60 * 1000);

  await new RegistrationOTPModel({
    userId: user._id,
    email: user.email,
    token: otp,
    expiresAt: expiration,
    isVerified: false,
  }).save();

  await sendRegistrationVerificationEmail(user.email, user.name, otp);
  return { message: "Registration verification email sent." };
};

export const verifyRegistrationOTPService = async (email: string, token: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const otpRecord = await RegistrationOTPModel.findOne({
    userId: user._id,
    email,
    isVerified: false,
    expiresAt: { $gt: new Date() }
  });

  if (!otpRecord) {
    return { success: false, user: null };
  }

  const isValid = await bcrypt.compare(token, otpRecord.token);
  if (!isValid) {
    return { success: false, user: null };
  }

  // Mark OTP as verified
  otpRecord.isVerified = true;
  await otpRecord.save();

  // Mark user as verified
  user.isEmailVerified = true;
  await user.save();

  return {
    success: true,
    user: user.omitPassword()
  };
};
