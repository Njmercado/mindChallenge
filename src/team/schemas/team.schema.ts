import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TeamAction } from 'src/team-moves/entities/team-action.enum';
import { TeamMove } from 'src/team-moves/schemas/team-moves.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({ ref: 'User' })
  users: Array<mongoose.Types.ObjectId>; 

  @Prop({required: true})
  name: string;

  @Prop([{ type: TeamMove }])
  moves: Array<TeamMove>;

  @Prop({ default: false})
  disabled: boolean;

  addTeamMove: Function;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.methods.addTeamMove = async function(
  users: mongoose.Types.ObjectId[], 
  actionType: TeamAction,
) {
  users.forEach(async user => {
    const teamMove = new TeamMove()
      teamMove.userId = user,
      teamMove.action = actionType,
    this.moves.push(teamMove);
  });
}

TeamSchema.pre('save', async function(next) {

  var prevValue: Team;

  if(this._id) {
    prevValue = await this.model().findById(this._id).exec();
  }

  // if new users where added
  if(this.getChanges().$push) {
    this.addTeamMove(
      this.getChanges().$push.users.$each,
      TeamAction.ADD,
    );
  }

  if(this.getChanges().$set) {
    const currentUsers = this.getChanges().$set.users.map(x => x.toString());

    const deletedUsers = prevValue.users.filter(user => 
      !currentUsers.includes(user.toString())
    );

    this.addTeamMove(
      deletedUsers,
      TeamAction.DELETE
    );
  }

  next();
});