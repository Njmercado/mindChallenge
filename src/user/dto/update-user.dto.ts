import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class UpdateUserDto {
  @ApiProperty({required: false})
  @MinLength(10)
  @MaxLength(100)
  name?: string;

  @ApiProperty({required: false})
  @IsEnum(Role)
  role?: Role = Role.USER;
}
