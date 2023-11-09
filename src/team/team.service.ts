import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamRepository } from './repository/mongo/team.repository.mongo';

export class TeamService {

  constructor(
    private teamRepository: TeamRepository,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    return this.teamRepository.createTeam(createTeamDto);
  }

  async findAll() {
    return null;
  }

  async findOne(id: string) {
    return this.teamRepository.findOneTeam(id);
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    return this.teamRepository.updateTeam(teamId, updateTeamDto.users);
  }

  remove(id: string) {
    return `This action removes a #${id} team`;
  }
}
