import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TeamUser } from 'src/user/entities/team-user.entity';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({ required: true })
  users: TeamUser[];

  @Prop({required: true})
  name: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);