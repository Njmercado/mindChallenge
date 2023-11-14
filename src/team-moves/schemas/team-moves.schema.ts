import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { TeamAction } from "../entities/team-action.enum";

export type TeamMoveDocument = HydratedDocument<TeamMove>;

@Schema()
export class TeamMove {
  @Prop({ref: 'User'})
  userId: mongoose.Types.ObjectId;
  @Prop({ enum: TeamAction})
  action: string;
  @Prop({
    type: Number,
    default: function() {
      return this.action === TeamAction.ADD && 
        Date.now() 
    } 
  })
  addedAt?: number;
  @Prop({
    type: Number,
    default: function() {
      return this.action === TeamAction.DELETE && 
        Date.now()
    } 
  })
  outAt?: number;
}

export const TeamMoveSchema = SchemaFactory.createForClass(TeamMove);