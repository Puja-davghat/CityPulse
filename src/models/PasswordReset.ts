import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPasswordReset extends Document {
  _id: mongoose.Types.ObjectId;
  token_hash: string;
  user_id: mongoose.Types.ObjectId;
  expires_at: Date;
  used_at: Date | null;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  token_hash: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires_at: { type: Date, required: true },
  used_at: { type: Date, default: null },
});

passwordResetSchema.index({ token_hash: 1 });
passwordResetSchema.index({ expires_at: 1 }, { expireAfterSeconds: 86400 }); // cleanup after 24h

export const PasswordReset: Model<IPasswordReset> = mongoose.models.PasswordReset || mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);
