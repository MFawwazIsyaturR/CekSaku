import { getEnv } from "../utils/get-env";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),

  PORT: getEnv("PORT", "8000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", ""),

  JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt") as string,
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m") as string,

  JWT_REFRESH_SECRET: getEnv(
    "JWT_REFRESH_SECRET",
    "secert_jwt_refresh"
  ) as string,
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d") as string,

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getEnv("GOOGLE_REDIRECT_URI"),

  GEMINI_API_KEY: getEnv("GEMINI_API_KEY") as string,

  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  RESEND_MAILER_SENDER: getEnv("RESEND_MAILER_SENDER", ""),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost") as string,

   GITHUB_CLIENT_ID: getEnv("GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnv("GITHUB_CLIENT_SECRET"),

  MIDTRANS_SERVER_KEY: getEnv("MIDTRANS_SERVER_KEY"),
  MIDTRANS_CLIENT_KEY: getEnv("MIDTRANS_CLIENT_KEY"),
  MIDTRANS_IS_PRODUCTION: getEnv("MIDTRANS_IS_PRODUCTION", "false"),
});

export const Env = envConfig();
