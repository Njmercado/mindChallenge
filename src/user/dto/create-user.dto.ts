import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../entities/role.enum";
import { IsEmail, IsEnum, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

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

  @ApiProperty({required: true})
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'invalid password, remember password must have number, upppercase letters, lowercase letters, simbols and be at leat 8 characters long'})
  password: string;

  @ApiProperty({required: true})
  @IsEnum(Role)
  role: Role = Role.USER;
}
