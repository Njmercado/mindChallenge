import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";

export class TeamUser {

  constructor(id: mongoose.Types.ObjectId) {
    this.id = id;
  }

  @Prop({ref: 'User'})
  id: mongoose.Types.ObjectId;
  addedAt: Date = new Date();
  outAt?: Date;
  available: { type: boolean, default: true };
}