import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decotaror';
import { Role } from 'src/user/entities/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilterTeamMovementsDto } from 'src/team-moves/dto/filter-team-movement.dto';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles([Role.ADMIN, Role.SUPER_ADMIN])
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }

  @Get('/filter-movements')
  filterTeamMovements(
    @Query() filter: FilterTeamMovementsDto,
  ) {
    return this.teamService.filterTeamMovements(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Put('/move/:userId/:fromTeam/:toTeam')
  move(
    @Param('userId') userId: string,
    @Param('fromTeam') fromTeam: string,
    @Param('toTeam') toTeam: string,
  ) {
    return this.teamService.move(userId, fromTeam, toTeam);
  }
}
