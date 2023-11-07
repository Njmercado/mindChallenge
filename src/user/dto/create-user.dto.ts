import { IsOptional } from "class-validator";

export class CreateUserDto {
  name: string;
  mail: string;
  password: string;
}
