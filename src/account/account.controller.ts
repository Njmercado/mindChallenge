import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../user/entities/role.enum';
import { Roles } from '../auth/decorator/roles.decotaror';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Roles([Role.ADMIN, Role.SUPER_ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
