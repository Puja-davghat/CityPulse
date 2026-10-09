import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  token_hash: string;
  user_id: mongoose.Types.ObjectId;
  user_agent: string;
  ip: string;
  created_at: Date;
  expires_at: Date;
}

const sessionSchema = new Schema<ISession>({
  token_hash: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_agent: { type: String, default: '' },
  ip: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
});

sessionSchema.index({ token_hash: 1 });
sessionSchema.index({ user_id: 1 });
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
