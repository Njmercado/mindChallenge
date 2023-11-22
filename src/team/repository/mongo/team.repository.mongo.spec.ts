import { TeamRepository } from './team.repository.mongo';
import { CreateTeamDto } from 'src/team/dto/create-team.dto';
import { HelperGeneral } from '../../../helpers/helper.general';
import { IDs, IDsToAdd } from '../../../helpers/constants/helper.constant';
import { TEAM_ID_2_STR, TEAM_ID_STR, TEAM_MODEL_MOCK } from '../../../team/contants/team.spec.contants';
import { UpdateTeamDto } from 'src/team/dto/update-team.dto';
import { HttpStatus } from '@nestjs/common';
import { USER_MODEL_MOCK, USER_MODEL_WITH_NO_ASSIGNED_TEAM_MOCK } from '../../../user/contants/user.spec.contants';

describe('TeamRepository', () => {
  let teamRepository: TeamRepository;
  let teamModel;
  let userModel;
  let teamMoveModel;
  let helperGeneral: HelperGeneral;

  beforeEach(async () => {
    helperGeneral = new HelperGeneral();
    teamModel = jest.mock('../../schemas/team.schema');
    teamModel = TEAM_MODEL_MOCK;

    userModel = jest.mock('../../../user/schemas/user.schema');
    userModel = USER_MODEL_MOCK;

    teamMoveModel = {};

    teamRepository = new TeamRepository(teamModel, userModel, teamMoveModel);
  });

  it('should create a new team', async () => {

    const createTeamDto: CreateTeamDto = {
      users: IDs,
      name: 'My Team',
    };

    const usersAsMongoIds = helperGeneral.arrayIdsToMongoIds(createTeamDto.users);

    await teamRepository.createTeam(createTeamDto);

    expect(teamModel.create).toHaveBeenCalledWith({ users: usersAsMongoIds, name: createTeamDto.name });
  });

  it('should update a team with new users', async () => {
    const updateTeamDto: UpdateTeamDto = {
      users: [IDsToAdd[0], ...IDs],
      name: "Team 2"
    };

    jest.spyOn(teamRepository, 'deleteUserFromTeam').mockResolvedValue(null);
    jest.spyOn(teamRepository, 'addUserToTeam').mockResolvedValue(null);
    jest.spyOn(teamRepository, 'updateUserStatus').mockResolvedValue(null);

    await teamRepository.updateTeam(TEAM_ID_STR, updateTeamDto);

    expect(teamRepository.addUserToTeam)
      .toHaveBeenCalledTimes(1);

    expect(teamModel.save).toHaveBeenCalled();
  });

  describe('MoveUser', () => {
    it('should not move a user from one team to another because it has an assigned team', async () => {
      const response = await teamRepository.moveUser(
        IDs[0],
        TEAM_ID_STR,
        TEAM_ID_2_STR,
      );

      expect(response).toEqual({
        message: "Could not move user due this user has an assigned team",
        code: HttpStatus.CONFLICT
      });
    });

    it('should move user from one team to another one', async () => {
      userModel = USER_MODEL_WITH_NO_ASSIGNED_TEAM_MOCK;
      teamRepository = new TeamRepository(teamModel, userModel, teamMoveModel);

      const response = await teamRepository.moveUser(
        IDs[0],
        TEAM_ID_STR,
        TEAM_ID_2_STR,
      );

      expect(teamModel.save).toHaveBeenCalled();
      expect(userModel.save).toHaveBeenCalled();
      expect(response).toEqual({
        message: 'User moved successfully',
        code: HttpStatus.OK,
      });
    });
  });

  describe('FilterTeamMovements', () => {
    it('should return few moves', () => {

    });
  })
});