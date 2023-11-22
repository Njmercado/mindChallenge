import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from './entities/role.enum';
import { Roles } from '../auth/decorator/roles.decotaror';
import { FilterUserDto } from './dto/filter-user.dto';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Request() request: { user: any}
  ) {
    return this.userService.create(createUserDto);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get()
  findAll(
    @Request() request: { user: any}
  ) {
    return this.userService.findAll();
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get('/filter')
  filter(
    @Query() filters: FilterUserDto
  ) {
    return this.userService.filter(filters);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN, Role.USER])
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() request: { user: any}
  ) {
    return this.userService.findOne(id, request);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() request: { user: any}
  ) {
    return this.userService.update(id, updateUserDto, request.user);
  }

  @Roles([Role.SUPER_ADMIN])
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() request: { user: any}
  ) {
    return this.userService.remove(id);
  }
}
