import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password_hash: string;
  name: string;
  role: 'user' | 'admin';
  home_city: string;
  bio: string;
  avatar_path: string;
  locale: 'en' | 'hi';
  theme: 'light' | 'dark' | 'system';
  text_size: 'small' | 'medium' | 'large';
  email_prefs: {
    reports: boolean;
    updates: boolean;
  };
  failed_login_attempts: number;
  locked_until: Date | null;
  created_at: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  home_city: { type: String, default: '', maxlength: 100 },
  bio: { type: String, default: '', maxlength: 200 },
  avatar_path: { type: String, default: '' },
  locale: { type: String, enum: ['en', 'hi'], default: 'en' },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  text_size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  email_prefs: {
    reports: { type: Boolean, default: true },
    updates: { type: Boolean, default: true },
  },
  failed_login_attempts: { type: Number, default: 0 },
  locked_until: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

userSchema.index({ email: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
