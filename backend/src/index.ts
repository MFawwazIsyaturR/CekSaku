import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import helmet from "helmet";
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connectDB from "./config/database.config"; // Pastikan import ini benar
import authRoutes from "./routes/auth.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import { initializeCrons } from "./cron";
import reportRoutes from "./routes/report.route";
import analyticsRoutes from "./routes/analytics.route";
import { initializeMidtrans } from "./config/midtrans.config";
import paymentRoutes from "./routes/payment.route";
import assetRoutes from "./routes/asset.route"; // Import route aset

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Middleware global untuk memastikan DB connect sebelum proses request apapun
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Berhasil terhubung ke backend CekSaku",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);
app.use(`${BASE_PATH}/payment`, paymentRoutes);
app.use(`${BASE_PATH}/asset`, passportAuthenticateJwt, assetRoutes); // Daftarkan route aset

app.use(errorHandler);

// Inisialisasi Midtrans
initializeMidtrans();

if (Env.NODE_ENV !== "production") {
  app.listen(Env.PORT, async () => {
    // Di local dev, connect sekali di awal
    await connectDB(); 
    if (Env.NODE_ENV === "development") {
      await initializeCrons();
    }
    console.log(
      `Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`,
    );
  });
}

module.exports = app;