import { PartialType } from '@nestjs/swagger';
import { CreateTeamMoveDto } from './create-team-move.dto';

export class UpdateTeamMoveDto extends PartialType(CreateTeamMoveDto) {}
