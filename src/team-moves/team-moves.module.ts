import { Module } from '@nestjs/common';
import { TeamMovesService } from './team-moves.service';
import { TeamMovesController } from './team-moves.controller';

@Module({
  controllers: [TeamMovesController],
  providers: [TeamMovesService],
})
export class TeamMovesModule {}
