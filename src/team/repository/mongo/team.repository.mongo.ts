import { InjectModel } from "@nestjs/mongoose";
import { Team, TeamDocument } from "../../schemas/team.schema";
import { Model } from "mongoose";
import { HelperGeneral } from "src/helpers/helper.general";
import { CreateTeamDto } from "src/team/dto/create-team.dto";
import { UpdateTeamDto } from "src/team/dto/update-team.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/user/schemas/user.schema";
import { FilterTeamMovementsDto } from "src/team-moves/dto/filter-team-movement.dto";
import { FilterTeamDto } from "src/team/dto/filter-team.dto";

@Injectable()
export class TeamRepository {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  helper = new HelperGeneral();

  async createTeam(createTeamDto: CreateTeamDto): Promise<void> {
    const { users, name } = createTeamDto;
    const usersAsMongoIds = this.helper.arrayIdsToMongoIds(users);

    await this.teamModel.create({users: usersAsMongoIds, name});

    this.updateUsersStatuses(users, [])
  }

  async findOneTeam(id: string) {
    return this.teamModel.findById(id).exec();
  }

  async updateTeam(teamId: string, updateTeamDto: UpdateTeamDto): Promise<{
    message: string,
    code: number
  }> {

    const team = await this.teamModel.findById(teamId).exec();
    const {users, name} = updateTeamDto;
    if(users) {
      const usersToAdd = users.filter(
        user => !team.users.includes(
          this.helper.toMongoID(user)
        )
      );
      const usersToDelete = team.users.filter(
        user => !users.includes(
          user.toString()
        )
      );

      for(const user of usersToDelete) {
        await this.deleteUserFromTeam(user.toString(), team);
      }

      for(const user of usersToAdd) {
        await this.addUserToTeam(user, team)
      }
    }

    if(name) {
      team.name = name
    }

    await team.save();

    return {
      message: `Team ${team.name} udpated successfully`,
      code: 200,
    };
  }

  async removeTeam(id: string) {
    const response = await this.teamModel.findByIdAndUpdate(
      id,
      {
        $set: { disabled: true }
      }
    ).exec()

    if(response) {
      const team = await this.teamModel.findById(id).exec();
      for(const user of team.users) {
        await this.deleteUserFromTeam(user.toString(), team);
      }
    }
  }

  async moveUser(userId: string, fromTeam: string, toTeam: string): Promise<{
    message: string,
    code: number,
  }> {
    const user = await this.userModel.findById(userId).exec();
    const sourceTeam = await this.teamModel.findById(fromTeam).exec();
    const targetTeam = await this.teamModel.findById(toTeam).exec();

    if(user.hasAssignedTeam) {
      return {
        message: "Could not move user due this user has an assigned team",
        code: 205 // TODO: change code
      }
    } else {
      sourceTeam.users.splice(
        sourceTeam.users.indexOf(this.helper.toMongoID(userId)),
        1
      )
      targetTeam.users.push(this.helper.toMongoID(userId));
      user.hasAssignedTeam = true;

      sourceTeam.save();
      targetTeam.save();
      await user.save();

      return {
        message: 'User moved successfully',
        code: 200,
      }
    }
  }

  private async deleteUserFromTeam(userId: string, team: TeamDocument): Promise<{
    message: string,
    code: number,
    data: any,
  }> {
    const userBelongsToTeam = () => team.users.includes(this.helper.toMongoID(userId));

    if(userBelongsToTeam()) {
      team.users.splice(
        team.users.indexOf(this.helper.toMongoID(userId)),
        1
      )

      this.updateUserStatus(userId, false);

      return {
        message: `User ${userId} deleted from team ${team.name}`,
        code: 200,
        data: userId
      }
    } else {
      return {
        message: `User ${userId} does not exist in team ${team.name}`,
        code: 404,
        data: null,
      }
    }
  }

  private async addUserToTeam(userId: string, team: TeamDocument): Promise<{
    message: string,
    code: number
  }> {
    
    const user = await this.userModel.findById(userId);
    const userhasTeam = () => user.hasAssignedTeam;

    if(userhasTeam()) {
      return {
        message: `User ${user.name} already assigned to team`,
        code: 404,
      }
    } else {
      team.users.push(this.helper.toMongoID(userId));
      user.hasAssignedTeam = true;

      await user.save();
    }
  }

  // TODO: Add pagination
  async filterTeamMovements(filters: FilterTeamMovementsDto) {
    try {
      return await this.teamModel.find({})
      .populate({
        path: 'moves.userId',
        select: 'name email',
        match: {
          ...(filters.nameOfTheUser && { name: { $regex: filters.nameOfTheUser, $options: 'i' }}),
          ...(filters.userEmail && { email: { $regex: filters.userEmail, $options: 'i' }}),
        }
      })
      .select('name moves.action moves.addedAt moves.outAt')
      .exec()
      .then(function(results) {
        return results.map( result => {
          return {
            name: result.name,
            _id: result._id,
            moves: result.moves.filter( move => 
              move.userId !== null &&
              (filters.action ? move.action === filters.action: true) &&
              move.addedAt >= Number(filters.startAt) &&
              move.outAt <= Number(filters.endAt)
            ) 
          }
        })
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async filter(filters: FilterTeamDto) {
    try {
      return await this.teamModel.find({
        ...(filters.name && { name: { $regex: filters.name, $options: 'i' }}),
      })
      .populate({
        path: 'users',
        match: {
          ...(filters.userName && { name: { $regex: filters.userName, $options: 'i' } }),
          ...(filters.userEmail && { email: {$regex: filters.userEmail, $options: 'i' }}),
        },
        select: 'name email role'
      })
      .select('users name')
      .exec();
    } catch(error) {
      console.error(error)
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private updateUsersStatuses(ids: string[], states: boolean[]) {
    ids.forEach((id: string, index: number) => {
      this.updateUserStatus(id, states[index]);
    });
  }

  // TODO: Move this to user service
  private updateUserStatus(id: string, state: boolean) {
    this.userModel.findByIdAndUpdate(id, { $set: { hasAssignedTeam: state }}).exec();
  }
}