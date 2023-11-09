import { Injectable } from '@nestjs/common';
import { CreateTeamMoveDto } from './dto/create-team-move.dto';
import { UpdateTeamMoveDto } from './dto/update-team-move.dto';

@Injectable()
export class TeamMovesService {
  create(createTeamMoveDto: CreateTeamMoveDto) {
    return 'This action adds a new teamMove';
  }

  findAll() {
    return `This action returns all teamMoves`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamMove`;
  }

  update(id: number, updateTeamMoveDto: UpdateTeamMoveDto) {
    return `This action updates a #${id} teamMove`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamMove`;
  }
}
