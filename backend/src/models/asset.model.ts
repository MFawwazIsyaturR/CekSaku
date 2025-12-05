import mongoose, { Schema, Document } from "mongoose";
import { convertToCents, convertToDollarUnit } from "../utils/format-currency";

export enum AssetCategoryEnum {
  CASH = "cash",
  INVESTMENT = "investment",
  PROPERTY = "property",
  CRYPTO = "crypto",
}

export interface AssetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: keyof typeof AssetCategoryEnum;
  amount: number;
  institution?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<AssetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(AssetCategoryEnum),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
      // Simpan di DB sebagai cents (dikali 100), baca sebagai unit biasa (dibagi 100)
      set: (value: number) => convertToCents(value),
      get: (value: number) => convertToDollarUnit(value),
    },
    institution: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, // Penting agar getter amount berjalan saat dikirim ke frontend
    toObject: { getters: true },
  }
);

const AssetModel = mongoose.model<AssetDocument>("Asset", assetSchema);

export default AssetModel;