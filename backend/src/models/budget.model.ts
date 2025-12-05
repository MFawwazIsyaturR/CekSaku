import mongoose, { Schema, Document } from "mongoose";
import { convertToCents, convertToDollarUnit } from "../utils/format-currency";

export interface BudgetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number; // Limit anggaran
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<BudgetDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    category: { type: String, required: true },
    amount: {
      type: Number,
      required: true,
      default: 0,
      set: (value: number) => convertToCents(value),
      get: (value: number) => convertToDollarUnit(value),
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Satu user hanya boleh punya 1 budget per kategori
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

const BudgetModel = mongoose.model<BudgetDocument>("Budget", budgetSchema);
export default BudgetModel;