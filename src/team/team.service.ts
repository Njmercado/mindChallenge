import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamRepository } from './repository/mongo/team.repository.mongo';
import { FilterTeamMovementsDto } from 'src/team-moves/dto/filter-team-movement.dto';

@Injectable()
export class TeamService {

  constructor(
    private teamRepository: TeamRepository,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    return this.teamRepository.createTeam(createTeamDto);
  }

  async findOne(id: string) {
    return this.teamRepository.findOneTeam(id);
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    return this.teamRepository.updateTeam(teamId, updateTeamDto);
  }

  remove(id: string) {
    return this.teamRepository.removeTeam(id); 
  }

  filterTeamMovements(filters: FilterTeamMovementsDto) {
    return this.teamRepository.filterTeamMovements(filters);
  }

  move(userId: string, fromTeam: string, toTeam: string) {
    return this.teamRepository.moveUser(userId, fromTeam, toTeam);
  }
}
