import { InjectModel } from "@nestjs/mongoose";
import { Team } from "../../schemas/team.schema";
import { Model } from "mongoose";
import { TeamUser } from "src/user/entities/team-user.entity";
import { HelperGeneral } from "src/helpers/helper.general";
import { CreateTeamDto } from "src/team/dto/create-team.dto";
import { UpdateTeamDto } from "src/team/dto/update-team.dto";
import { FilterTeamDto } from "src/team/dto/filter-team.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TeamRepository {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ) {}
  helper = new HelperGeneral();

  async createTeam(createTeamDto: CreateTeamDto): Promise<void> {
    const { users, name } = createTeamDto;
    const usersAsMongoIds = this.helper.arrayIdsToMongoIds(users);
    this.teamModel.create({users: usersAsMongoIds, name});
    // TODO: add event to team move
  }

  async addUsersToTeam(teamId: string, userIds: Array<string>): Promise<any> {
    const team = await this.teamModel.findById(teamId).exec();
    userIds.forEach(id => {
      team.users.push(this.helper.toMongoID(id));
    });

    await team.save();

    return team;
  }

  async findOneTeam(id: string) {
    return this.teamModel.findById(id).exec();
  }

  async updateTeam(teamId: string, updateTeamDto: UpdateTeamDto) {
    //TODO: split userIds between added and deleted ones for events
    const userIdsToMongoId = updateTeamDto.users.map(userId => this.helper.toMongoID(userId));
    const update = {...updateTeamDto, userIdsToMongoId}

    return await this.teamModel.findByIdAndUpdate(teamId, update);
  }

  async removeTeam(id: string) {
    // TODO: create an event to define when a user was removed from a team
    // TODO: create event for when a user were quit from the team
    return this.teamModel.findByIdAndRemove(id).exec()
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
}