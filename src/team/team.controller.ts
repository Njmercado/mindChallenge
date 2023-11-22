import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decotaror';
import { Role } from '../user/entities/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilterTeamMovementsDto } from 'src/team-moves/dto/filter-team-movement.dto';
import { FilterTeamDto } from './dto/filter-team.dto';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @Request() request: { user: any}
  ) {
    return this.teamService.create(createTeamDto);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get('/filter')
  filter(
    @Query() filter: FilterTeamDto,
  ) {
    return this.teamService.filter(filter);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get('/filter-movements')
  filterTeamMovements(
    @Query() filter: FilterTeamMovementsDto,
  ) {
    return this.teamService.filterTeamMovements(filter);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Put('/move/:userId/:fromTeam/:toTeam')
  move(
    @Param('userId') userId: string,
    @Param('fromTeam') fromTeam: string,
    @Param('toTeam') toTeam: string,
  ) {
    return this.teamService.move(userId, fromTeam, toTeam);
  }
}
