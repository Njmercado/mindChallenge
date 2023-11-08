import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  clientName: string;

  @Prop({required: true})
  responsable: {type: mongoose.Schema.Types.ObjectId, ref: 'User'};

  @Prop({required: true})
  groups: {type: mongoose.Schema.Types.ObjectId[], ref: 'Group'};
}

export const AccountSchema = SchemaFactory.createForClass(Account);