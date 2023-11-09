import { InjectModel } from "@nestjs/mongoose";
import { Team } from "../../schemas/team.schema";
import { Model } from "mongoose";
import { TeamUser } from "src/user/entities/team-user.entity";
import { HelperGeneral } from "src/helpers/helper.general";
import { CreateTeamDto } from "src/team/dto/create-team.dto";

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

  async updateTeam(teamId: string, userIds: string[]) {
    //TODO: split userIds between added and deleted ones for events
    const userIdsToMongoId = userIds.map(userId => this.helper.toMongoID(userId));

    return await this.teamModel.findByIdAndUpdate(teamId, { $set: { users: userIdsToMongoId } });
  }


}