import { InjectModel } from "@nestjs/mongoose";
import { Team } from "../../schemas/team.schema";
import { Model } from "mongoose";
import { TeamUser } from "src/user/entities/team-user.entity";
import { HelperGeneral } from "src/helpers/helper.general";
import { CreateTeamDto } from "src/team/dto/create-team.dto";
import { UpdateTeamDto } from "src/team/dto/update-team.dto";
import { FilterTeamDto } from "src/team/dto/filter-team.dto";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/schemas/user.schema";

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
    // TODO: add event to team move
  }

  async findOneTeam(id: string) {
    return this.teamModel.findById(id).exec();
  }

  async updateTeam(teamId: string, updateTeamDto: UpdateTeamDto) {

    const team = await this.teamModel.findById(teamId).exec();
    const {users, name} = updateTeamDto;
    //TODO: split userIds between added and deleted ones for events

    if(users) {
      const isUserIncluded = user => team.users.includes(
        this.helper.toMongoID(user)
      ); 
      const usersToAdd = users.filter( user => !isUserIncluded(user));
      const usersToDelete = team.users.filter(user => !users.includes(user.toString()));
      
      console.log([usersToDelete, usersToAdd]);

      const responseDeletedUsers = usersToDelete.map(user => this.quitUserFromTeam(user.toString(), teamId));
      const responseAddedUsers = usersToAdd.map(user => this.addUserToTeam(user, teamId));
    }

    if(name) {
      team.name = name
    }

    await team.save();

    return team;
  }

  async removeTeam(id: string) {
    // TODO: create an event to define when a user was removed from a team
    // TODO: create event for when a user were quit from the team
    return this.teamModel.findByIdAndRemove(id).exec()
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
      // TODO: add event of quit user from team

      targetTeam.users.push(this.helper.toMongoID(userId));
      // TODO: add event of adding user to team

      user.hasAssignedTeam = true;

      sourceTeam.save();
      targetTeam.save();
      user.save();

      return {
        message: 'User moved successfully',
        code: 200,
      }
    }
  }

  private async quitUserFromTeam(userId: string, teamId: string): Promise<{
    message: string,
    code: number
  }> {
    const team = await this.teamModel.findById(teamId).exec();

    const userBelongsToTeam = () => team.users.includes(this.helper.toMongoID(userId));

    if(userBelongsToTeam()) {
      team.users.splice(
        team.users.indexOf(this.helper.toMongoID(userId)),
        1
      )
      
      await team.save();

      this.updateUserStatus(userId, false);

      // TODO: add that user x has been deleted from team x into events

      return {
        message: `User ${userId} deleted from team ${team.name}`,
        code: 200
      }
    } else {
      return {
        message: `User ${userId} does not exist in team ${team.name}`,
        code: 404,
      }
    }
  }

  private async addUserToTeam(userId: string, teamId: string): Promise<{
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
      const team = await this.teamModel.findById(teamId);
      team.users.push(this.helper.toMongoID(userId));
      user.hasAssignedTeam = true;

      team.save();
      user.save();
    }
  }

  async filterTeam(filters: FilterTeamDto) {

    const {id, name, userName, addedAt, outAt} = filters;

    const query = this.teamModel.find();

    if(name) {

    }

    const response = await this.teamModel.find({
      name: { $regex: filters.name, $options: 'i' },
    }).exec();

    return response;
  }

  private updateUsersStatuses(ids: string[], states: boolean[]) {
    ids.forEach((id: string, index: number) => {
      this.updateUserStatus(id, states[index]);
    });
  }

  private updateUserStatus(id: string, state: boolean) {
    this.userModel.findByIdAndUpdate(id, { $set: { hasAssignedTeam: state }}).exec();
  }
}