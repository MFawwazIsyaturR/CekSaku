import { Router } from "express";
import {
  forgotPasswordController, // <-- Impor
  resetPasswordController,  // <-- Impor
  verifyResetTokenController,
  githubLoginController,
  googleLoginController,
  loginController,
  registerController,
  refreshController,
  logoutController,
  sendRegistrationOTPController,
  verifyRegistrationOTPController,
} from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

// Limiter KETAT untuk Login & Lupa Password (misal: 10 percobaan per 15 menit)
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 10, // Batasi setiap IP hingga 10 permintaan per jendela waktu
  message: 'Terlalu banyak percobaan dari IP ini, silakan coba lagi setelah 15 menit.',
  statusCode: 429,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Limiter SEDANG untuk Registrasi (misal: 50 percobaan per jam)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  limit: 50, // Batasi setiap IP hingga 50 permintaan per jendela waktu
  message: 'Terlalu banyak permintaan pendaftaran dari IP ini, silakan coba lagi nanti.',
  statusCode: 429,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Limiter KETAT untuk Verifikasi & Reset (penting untuk mencegah brute force token)
const resetTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    limit: 5, // Lebih ketat karena melibatkan token
    message: 'Terlalu banyak percobaan reset password dari IP ini.',
    statusCode: 429,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });


const authRoutes = Router();

// Penerapan registerLimiter HANYA ke rute /register
authRoutes.post("/register", registerLimiter, registerController);

// Rute untuk mengirim OTP verifikasi registrasi
authRoutes.post("/send-registration-otp", registerLimiter, sendRegistrationOTPController);

// Rute untuk verifikasi OTP registrasi
authRoutes.post("/verify-registration-otp", registerLimiter, verifyRegistrationOTPController);

// Penerapan strictAuthLimiter HANYA ke rute /login
authRoutes.post("/login", strictAuthLimiter, loginController);

authRoutes.post("/google", googleLoginController);
authRoutes.post("/github", githubLoginController);

// Penerapan strictAuthLimiter HANYA ke rute /forgot-password
authRoutes.post("/forgot-password", strictAuthLimiter, forgotPasswordController);

// Penerapan resetTokenLimiter ke rute verifikasi dan reset
authRoutes.post("/verify-reset-token", resetTokenLimiter, verifyResetTokenController);
authRoutes.post("/reset-password", resetTokenLimiter, resetPasswordController);

authRoutes.post("/refresh-token", refreshController);
authRoutes.post("/logout", logoutController);

export default authRoutes;