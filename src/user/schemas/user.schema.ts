import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({default: false})
  hasAssignedTeam: boolean;

  comparePassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
}

UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
});