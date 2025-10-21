import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const PasswordResetTokenSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 900000), index: { expires: '15m' } }, // Token valid & dihapus otomatis setelah 15 menit
});

// Hash token sebelum menyimpan untuk keamanan
PasswordResetTokenSchema.pre<IPasswordResetToken>('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

export default mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);