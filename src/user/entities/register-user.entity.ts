import mongoose from "mongoose";

export class RegisterUser {
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' };
  inDate: Date;
  outDate: Date;
}