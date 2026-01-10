import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  image: String,
  emailVerified: Date,
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);