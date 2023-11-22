import { InjectModel } from "@nestjs/mongoose";
import { Team, TeamDocument } from "../../schemas/team.schema";
import { Model } from "mongoose";
import { HelperGeneral } from "../../../helpers/helper.general";
import { CreateTeamDto } from "src/team/dto/create-team.dto";
import { UpdateTeamDto } from "src/team/dto/update-team.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../../../user/schemas/user.schema";
import { FilterTeamMovementsDto } from "src/team-moves/dto/filter-team-movement.dto";
import { FilterTeamDto } from "src/team/dto/filter-team.dto";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { TeamMove } from "../../../team-moves/schemas/team-moves.schema";

@Injectable()
export class TeamRepository {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TeamMove.name) private teamMoveModel: Model<TeamMove>,
  ) { }
  helper = new HelperGeneral();

  async createTeam(createTeamDto: CreateTeamDto): Promise<any> {
    try {
      const { users, name } = createTeamDto;
      const usersAsMongoIds = this.helper.arrayIdsToMongoIds(users);

      const team = await this.teamModel.create({ users: usersAsMongoIds, name });

      if (team) {
        this.updateUsersStatuses(users, [])

        return {
          message: 'Team created successfully',
          code: HttpStatus.OK
        }
      } else {
        return {
          message: 'Team could not be created',
          code: HttpStatus.EXPECTATION_FAILED
        }
      }
    } catch (err) {
      throw new ExceptionsHandler(err);
    }
  }

  async findOneTeam(id: string) {
    return this.teamModel.findById(id).exec();
  }

  async updateTeam(teamId: string, updateTeamDto: UpdateTeamDto): Promise<{
    message: string,
    code: number
  }> {

    const team = await this.teamModel.findById(teamId).exec();
    const { users, name } = updateTeamDto;
    if (users) {
      const currentUsersAsString = this.helper.arrayMongoIdsToString(team.users);
      const usersToAdd = users.filter(
        user =>
          !currentUsersAsString.includes(
            user
          )
      );
      const usersToDelete = team.users.filter(
        user => !users.includes(
          user.toString()
        )
      );

      for (const user of usersToDelete) {
        await this.deleteUserFromTeam(user.toString(), team);
      }

      for (const user of usersToAdd) {
        await this.addUserToTeam(user, team)
      }
    }

    if (name) {
      team.name = name
    }

    await team.save();

    return {
      message: `Team ${team.name} udpated successfully`,
      code: HttpStatus.OK,
    };
  }

  async removeTeam(id: string) {
    const response = await this.teamModel.findByIdAndUpdate(
      id,
      {
        $set: { disabled: true }
      }
    ).exec()

    if (response) {
      const team = await this.teamModel.findById(id).exec();
      for (const user of team.users) {
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

    if (user.hasAssignedTeam) {
      return {
        message: "Could not move user due this user has an assigned team",
        code: HttpStatus.CONFLICT
      }
    } else {
      const userIdToObjectId = this.helper.toMongoID(userId);
      sourceTeam.users.splice(
        sourceTeam.users.indexOf(userIdToObjectId),
        1
      )
      targetTeam.users.push(userIdToObjectId);
      user.hasAssignedTeam = true;

      await sourceTeam.save();
      await targetTeam.save();
      await user.save();

      return {
        message: 'User moved successfully',
        code: HttpStatus.OK,
      }
    }
  }

  async deleteUserFromTeam(userId: string, team: TeamDocument): Promise<{
    message: string,
    code: number,
    data: any,
  }> {
    const userBelongsToTeam = () => team.users.includes(this.helper.toMongoID(userId));

    if (userBelongsToTeam()) {
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

  async addUserToTeam(userId: string, team: TeamDocument): Promise<{
    message: string,
    code: number
  }> {

    const user = await this.userModel.findById(userId);
    const userhasTeam = () => user.hasAssignedTeam;

    if (userhasTeam()) {
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
      return this.teamMoveModel.find({
        ...(filters.action && { action: filters.action }),
        ...(filters.startAt && { addedAt: { $gte: filters.startAt } }),
        ...(filters.endAt && { outAt: { $lte: filters.endAt } }),
      })
        .populate({
          path: 'userId',
          select: '-_id name email',
          match: {
            ...(
              filters.nameOfTheUser &&
              {
                name: {
                  $regex: filters.nameOfTheUser,
                  $options: 'i'
                }
              }),
            ...(
              filters.userEmail &&
              {
                email: {
                  $regex: filters.userEmail,
                  $options: 'i'
                }
              })
          }
        })
        .populate({
          path: 'team',
          select: '-_id name'
        })
        .exec()
        .then(function (results) {
          return results.filter(result => result.userId !== null);
        });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async filter(filters: FilterTeamDto) {
    try {
      return this.teamModel.find({
        ...(filters.name && { name: { $regex: filters.name, $options: 'i' } }),
      })
        .populate({
          path: 'users',
          match: {
            ...(filters.userName && { name: { $regex: filters.userName, $options: 'i' } }),
            ...(filters.userEmail && { email: { $regex: filters.userEmail, $options: 'i' } }),
          },
          select: 'name email role'
        })
        .select('users name')
        .exec()
        .then(function (results) {
          return results.filter(result => result.users.length > 0 && {
            users: result.users.filter(user => user !== null),
            name: result.name
          })
        })
    } catch (error) {
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
  async updateUserStatus(id: string, state: boolean) {
    await this.userModel.findByIdAndUpdate(id, { $set: { hasAssignedTeam: state } }).exec();
  }
}