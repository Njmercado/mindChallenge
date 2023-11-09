import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class TeamMove {
  @Prop({ref: 'User'})
  id: mongoose.Types.ObjectId;
  addedAt: number = Date.now();
  outAt?: number;
}