import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayUnique, IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTeamDto {
  @IsArray()
  @ArrayUnique()
  @ApiProperty({required: false})
  @IsOptional()
  users: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: true})
  name: string;
}
