import { InjectModel } from "@nestjs/mongoose";
import { Team } from "../../schemas/team.schema";
import { Model } from "mongoose";
import { TeamUser } from "src/user/entities/team-user.entity";
import { HelperGeneral } from "src/helpers/helper.general";
import { CreateTeamDto } from "src/team/dto/create-team.dto";
import { UpdateTeamDto } from "src/team/dto/update-team.dto";

export class TeamRepository {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ) {}
  helper = new HelperGeneral();

  async createTeam(createTeamDto: CreateTeamDto): Promise<void> {
    const users = createTeamDto.users.map((userId: string) => 
      new TeamUser(this.helper.toMongoID(userId))
    );

      this.teamModel.create({users, name: createTeamDto.name});
  }

  async addUsersToTeam(teamId: string, userIds: Array<string>): Promise<any> {
    const team = await this.teamModel.findById(teamId).exec();
    userIds.forEach(id => {
      team.users.push(new TeamUser(
        this.helper.toMongoID(id)
      ));
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
}