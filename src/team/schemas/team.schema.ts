import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({ required: true, ref: 'User' })
  users: Array<mongoose.Types.ObjectId>; 

  @Prop({required: true})
  name: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);