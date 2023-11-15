import { ApiProperty } from "@nestjs/swagger";
import { TeamAction } from "../entities/team-action.enum";

export class FilterTeamMovementsDto {
  @ApiProperty({required: false, default: 0})
  startAt: number;

  @ApiProperty({required: false, default: 99999999999999})
  endAt: number;

  @ApiProperty({required: false, enum: TeamAction})
  action: TeamAction;

  @ApiProperty({required: false})
  nameOfTheUser: string;

  @ApiProperty({required: false})
  userEmail: string;
}