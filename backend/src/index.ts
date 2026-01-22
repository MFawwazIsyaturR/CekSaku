import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import helmet from "helmet"; // Import helmet
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connctDatabase from "./config/database.config";
import authRoutes from "./routes/auth.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import { initializeCrons } from "./cron";
import reportRoutes from "./routes/report.route";
import { getDateRange } from "./utils/date";
import analyticsRoutes from "./routes/analytics.route";
import connectDB from "./config/database.config";
import { initializeMidtrans } from "./config/midtrans.config";
import paymentRoutes from "./routes/payment.route";
import assetRoutes from "./routes/asset.route";
import budgetRoutes from "./routes/budget.route";
import adminRoutes from "./routes/admin.route";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Use helmet middleware

app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException("This is a test error");
    res.status(HTTPSTATUS.OK).json({
      message: "Berhasil terhubung ke backend",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);
app.use(`${BASE_PATH}/payment`, paymentRoutes);
app.use(`${BASE_PATH}/asset`, passportAuthenticateJwt, assetRoutes);
app.use(`${BASE_PATH}/budget`, passportAuthenticateJwt, budgetRoutes);
app.use(`${BASE_PATH}/admin`, passportAuthenticateJwt, adminRoutes);

app.use(errorHandler);

// Inisialisasi koneksi database saat server cold start
connectDB();
// Inisialisasi Midtrans
initializeMidtrans();

if (Env.NODE_ENV !== "production") {
  app.listen(Env.PORT, async () => {
    // connectDB() sudah dipanggil di atas,
    // tapi kita jalankan cron HANYA di dev
    if (Env.NODE_ENV === "development") {
      await initializeCrons();
    }
    console.log(
      `Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`,
    );
  });
}

module.exports = app;
