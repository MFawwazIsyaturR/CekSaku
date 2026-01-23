import mongoose, { Document, Schema } from "mongoose";

export enum PaymentStatusEnum {
    UNPAID = "BELUM DIBAYAR",
    PROCESSING = "PROSES",
    SUCCESS = "SUKSES",
}

export interface PaymentLogDocument extends Document {
    userId: mongoose.Types.ObjectId;
    orderId: string;
    amount: number;
    plan: string;
    status: PaymentStatusEnum;
    paymentType?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentLogSchema = new Schema<PaymentLogDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        plan: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatusEnum),
            default: PaymentStatusEnum.UNPAID,
        },
        paymentType: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const PaymentLogModel = mongoose.model<PaymentLogDocument>(
    "PaymentLog",
    paymentLogSchema
);

export default PaymentLogModel;
