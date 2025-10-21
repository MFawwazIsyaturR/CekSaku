import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  deleteUserService,
  findByIdUserService,
  updateUserService,
} from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";
import { updateUserSchema } from "../validators/user.validator";
import {
  changePasswordSchema,
} from "../validators/user.validator"; 
import {
  changePasswordService,
} from "../services/user.service";


export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await findByIdUserService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "User fetched successfully",
      user,
    });
  }
);

export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateUserSchema.parse(req.body);
    const userId = req.user?._id;
    const profilePic = req.file;

    const user = await updateUserService(userId, body, profilePic);

    return res.status(HTTPSTATUS.OK).json({
      message: "User profile updated successfully",
      data: user,
    });
  }
);
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    await deleteUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User account and all associated data deleted successfully",
    });
  }
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = changePasswordSchema.parse(req.body);

    await changePasswordService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Kata sandi berhasil diubah",
    });
  }
);