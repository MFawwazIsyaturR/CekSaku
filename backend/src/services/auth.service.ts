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
import { calulateNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { Env } from "../config/env.config";
import axios from "axios";
import { sendPasswordResetEmail } from "../mailers/mailer";
import crypto from "crypto";
import PasswordResetTokenModel from "../models/password-reset-token.model";
import bcrypt from 'bcrypt';


const googleClient = new OAuth2Client({
  clientId: Env.GOOGLE_CLIENT_ID,
  clientSecret: Env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'postmessage',
});

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;
  const session = await mongoose.startSession();
  try {
    let userResponse;
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) throw new UnauthorizedException("User already exists");
      
      const newUser = new UserModel({ ...body });
      await newUser.save({ session });
      
      const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        // FIX: Tambahkan argumen frekuensi
        nextReportDate: calulateNextReportDate(ReportFrequencyEnum.MONTHLY), 
        lastSentDate: null,
      });
      await reportSetting.save({ session });
      
      userResponse = { user: newUser.omitPassword() };
    });
    return userResponse;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("Email/password not found");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new UnauthorizedException("Invalid email/password");

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
            nextReportDate: calulateNextReportDate(ReportFrequencyEnum.MONTHLY), 
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
            nextReportDate: calulateNextReportDate(ReportFrequencyEnum.MONTHLY),
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
