import { ApiProperty } from "@nestjs/swagger";
import { TeamAction } from "src/team-moves/entities/team-action.enum";

export class FilterTeamDto {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  userName: string;

  @ApiProperty({ required: false, default: 0 })
  startAt: number;

  @ApiProperty({ required: false, default: Date.now()})
  endAt: number;

  @ApiProperty({ required: false, enum: TeamAction})
  action: TeamAction;
}