import mongoose from "mongoose";
import ReportSettingModel from "../models/report-setting.model";
import TransactionModel from "../models/transaction.model";
import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/app-error";
import { UpdateUserType } from "../validators/user.validator";
import { UnauthorizedException } from "../utils/app-error"; 
import { ChangePasswordType } from "../validators/user.validator"; 


export const findByIdUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserService = async (
  userId: string,
  body: UpdateUserType,
  profilePic?: Express.Multer.File
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  if (profilePic) {
    user.profilePicture = profilePic.path;
  }

  user.set({
    name: body.name,
  });

  await user.save();

  return user.omitPassword();
};

export const deleteUserService = async (userId: string) => {
  const session = await mongoose.startSession();
  try {
    let deletedCount = 0;
    await session.withTransaction(async () => {
      
      await TransactionModel.deleteMany({ userId }).session(session);

      await ReportSettingModel.deleteOne({ userId }).session(session);

      const userResult = await UserModel.findByIdAndDelete(userId).session(session);
      if (!userResult) {
        throw new NotFoundException("User not found");
      }
      deletedCount = 1;
    });

    return { success: true, deletedCount };
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const changePasswordService = async (
  userId: string,
  body: ChangePasswordType
) => {
  const { oldPassword, newPassword } = body;
  const user = await UserModel.findById(userId).select("+password");
  if (!user) throw new NotFoundException("Pengguna tidak ditemukan");

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedException("Kata sandi lama tidak valid");
  }

  user.password = newPassword;
  await user.save();
};