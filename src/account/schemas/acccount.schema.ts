import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  clientName: string;

  @Prop({required: true, ref: 'User'})
  responsable: mongoose.Schema.Types.ObjectId;

  @Prop([{type: mongoose.Types.ObjectId, required: true, ref: 'Team'}])
  teams: mongoose.Types.ObjectId[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);