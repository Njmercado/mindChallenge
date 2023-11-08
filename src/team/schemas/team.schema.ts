import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RegisterUser } from 'src/user/entities/register-user.entity';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({ required: true })
  users: RegisterUser[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);