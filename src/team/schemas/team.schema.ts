import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TeamAction } from '../../team-moves/entities/team-action.enum';
import { TeamMove, TeamMoveSchema } from '../../team-moves/schemas/team-moves.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({ ref: 'User' })
  users: Array<mongoose.Types.ObjectId>;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  disabled: boolean;

  addTeamMove: Function;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.methods.addTeamMove = async function (
  users: mongoose.Types.ObjectId[],
  actionType: TeamAction,
) {
  const TeamMoveModel = this.model(TeamMove.name);
  for (const user of users) {
    const team = new TeamMoveModel({
      team: this._id,
      userId: user,
      action: actionType
    });
    await team.save();
  }
}

TeamSchema.pre('save', async function (next) {
  const prevValue: Team = await this.model().findById(this._id).exec();
  const isNewDocument = () => !prevValue;

  if (isNewDocument()) {
    this.addTeamMove(
      this.getChanges().$set.users,
      TeamAction.ADD,
    );
  }
  else if (this._id) {

    // if new users where added
    if (this.getChanges().$push) {
      this.addTeamMove(
        this.getChanges().$push.users.$each,
        TeamAction.ADD,
      );
    }

    // if new users where deleted
    if (this.getChanges().$set) {
      const currentUsers = this.getChanges().$set.users.map(x => x.toString());

      const deletedUsers = prevValue.users.filter(user =>
        !currentUsers.includes(user.toString())
      );

      this.addTeamMove(
        deletedUsers,
        TeamAction.DELETE
      );
    }
  }

  next();
});