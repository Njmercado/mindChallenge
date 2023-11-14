import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../entities/role.enum";

export class CreateUserDto {
  @ApiProperty({required: true})
  name: string;

  @ApiProperty({required: true})
  email: string;

  @ApiProperty({required: true})
  password: string;

  @ApiProperty({required: true, enum: Role})
  role: Role;
}
