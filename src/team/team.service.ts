import { Inject, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { FilterTeamDto } from './dto/filter-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamRepository } from './repository/mongo/team.repository.mongo';

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

  filter(filters: FilterTeamDto) {
    return this.teamRepository.filterTeam(filters);
  }
}
