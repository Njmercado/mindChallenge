import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../entities/role.enum";

export class FilterUserDto {
  @ApiProperty({required: false})
  name: string;

  @ApiProperty({required: false})
  email: string;

  @ApiProperty({required: false, enum: Role})
  role: Role;

  @ApiProperty({required: false, type: Boolean})
  hasAssignedTeam: boolean;
}