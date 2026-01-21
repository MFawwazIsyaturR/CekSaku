import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { googleLoginSchema, loginSchema, registerSchema } from "../validators/auth.validator";
import { githubLoginService, googleLoginService, loginService, registerService, refreshTokenService, logoutService, sendRegistrationOTPService, verifyRegistrationOTPService } from "../services/auth.service";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import { forgotPasswordSchema, resetPasswordSchema, verifyResetTokenSchema } from "../validators/auth.validator";
import { forgotPasswordService, resetPasswordService, verifyResetTokenService} from "../services/auth.service";


export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      data: result,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse({
      ...req.body,
    });
    const { user, accessToken, expiresAt, reportSetting } =
      await loginService(body);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
      reportSetting,
    });
  }
);

export const googleLoginController = asyncHandler(
  async (req: Request, res: Response) => {

    const validationResult = googleLoginSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw new BadRequestException("Authorization code is missing or invalid in request body.");
    }
    
    const { code } = validationResult.data;

    const { user, accessToken, expiresAt, reportSetting } =
      await googleLoginService(code);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully with Google",
      user,
      accessToken,
      expiresAt,
      reportSetting,
    });
  }
);

export const githubLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;
    const result = await githubLoginService(code);
    res.status(HTTPSTATUS.OK).json(result);
  }
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await forgotPasswordService(email);
    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const verifyResetTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = verifyResetTokenSchema.parse(req.body);
    const result = await verifyResetTokenService(token);
    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const result = await resetPasswordService(token, password);
    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    // The user ID should be available from the JWT middleware
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new UnauthorizedException("User ID not found in token");
    }

    const result = await refreshTokenService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Token refreshed successfully",
      user: result.user,
      accessToken: result.accessToken,
      expiresAt: result.expiresAt,
      reportSetting: result.reportSetting,
    });
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new UnauthorizedException("User ID not found in token");
    }

    const result = await logoutService(userId);
    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const sendRegistrationOTPController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await sendRegistrationOTPService(email);
    return res.status(HTTPSTATUS.OK).json({ message: "Registration OTP sent successfully" });
  }
);

export const verifyRegistrationOTPController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, token } = req.body;
    const result = await verifyRegistrationOTPService(email, token);

    if (result.success) {
      return res.status(HTTPSTATUS.OK).json({
        message: "Email verified successfully",
        data: result.user
      });
    } else {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid or expired OTP"
      });
    }
  }
);