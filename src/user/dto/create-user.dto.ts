import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../entities/role.enum";
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  name: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // TODO: add validator for password
  @ApiProperty({required: true})
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'invalid password, remember password must have number, upppercase letters, lowercase letters, simbols and be at leat 8 characters long'})
  password: string;

  @ApiProperty({required: true, enum: Role, default: Role.USER})
  @IsNotEmpty()
  role: Role;
}
