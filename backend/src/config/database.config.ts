import mongoose from "mongoose";
import { Env } from "./env.config";

// Cache koneksi di global scope agar tidak hilang saat re-render (serverless)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. Jika sudah ada koneksi, langsung pakai (Cepat!)
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Jika belum, buat koneksi baru
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Jangan antri command jika putus, langsung error (Fail Fast)
      serverSelectionTimeoutMS: 5000, // Timeout lebih cepat (5s) daripada default (30s)
      socketTimeoutMS: 45000,
    };

    console.log("Creating new database connection...");
    cached.promise = mongoose.connect(Env.MONGO_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB database");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", e);
    throw e;
  }

  return cached.conn;
};

export default connectDB;