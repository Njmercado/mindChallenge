import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamMovesService } from './team-moves.service';
import { CreateTeamMoveDto } from './dto/create-team-move.dto';
import { UpdateTeamMoveDto } from './dto/update-team-move.dto';

@Controller('team-moves')
export class TeamMovesController {
  constructor(private readonly teamMovesService: TeamMovesService) {}

  @Post()
  create(@Body() createTeamMoveDto: CreateTeamMoveDto) {
    return this.teamMovesService.create(createTeamMoveDto);
  }

  @Get()
  findAll() {
    return this.teamMovesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMovesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamMoveDto: UpdateTeamMoveDto) {
    return this.teamMovesService.update(+id, updateTeamMoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMovesService.remove(+id);
  }
}
