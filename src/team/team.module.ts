import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamRepository } from './repository/mongo/team.repository.mongo';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { TeamMove, TeamMoveSchema } from 'src/team-moves/schemas/team-moves.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Team.name,
        schema: TeamSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: TeamMove.name,
        schema: TeamMoveSchema
      }
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
