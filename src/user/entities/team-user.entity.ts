import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";

export class TeamUser {

  constructor(id: mongoose.Types.ObjectId) {
    this.id = id;
  }

  @Prop({ref: 'User'})
  id: mongoose.Types.ObjectId;
  addedAt: number = Date.now();
  outAt?: number;
  available: { type: boolean, default: true };
}