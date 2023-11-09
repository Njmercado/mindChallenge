import { IsArray, ArrayUnique, IsString, IsNotEmpty } from "class-validator";

export class CreateTeamDto {
  @IsArray()
  @ArrayUnique()
  users: string[];

  @IsString()
  @IsNotEmpty()
  name: string;
}
