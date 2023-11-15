import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayUnique, IsString, IsNotEmpty } from "class-validator";

export class CreateTeamDto {
  @IsArray()
  @ArrayUnique()
  @ApiProperty({required: false})
  users: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: false})
  name: string;
}
