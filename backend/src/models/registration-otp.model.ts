import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IRegistrationOTP extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  isVerified: boolean;
}

const RegistrationOTPSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  email: { type: String, required: true, index: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 15 * 60 * 1000), index: { expires: '15m' } }, // Token valid & dihapus otomatis setelah 15 menit
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Hash token sebelum menyimpan untuk keamanan
RegistrationOTPSchema.pre<IRegistrationOTP>('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

export default mongoose.model<IRegistrationOTP>('RegistrationOTP', RegistrationOTPSchema);