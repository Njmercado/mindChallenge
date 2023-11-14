import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FilterTeamDto } from './dto/filter-team.dto';

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

  @Get('/filter')
  filter(
    @Query() filter: FilterTeamDto,
  ) {
    return this.teamService.filter(filter);
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
