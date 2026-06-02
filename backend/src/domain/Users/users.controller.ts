import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @GetOrganizationId() organizationId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(organizationId, createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetOrganizationId() organizationId: string) {
    return this.usersService.findAll(organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  findOne(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(organizationId, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  update(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(organizationId, id, updateUserDto);
  }

  @Post(':id/change-password')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  changePassword(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.updatePassword(organizationId, id, newPassword);
  }

  @Post(':id/deactivate')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  deactivate(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.deactivate(organizationId, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.remove(organizationId, id);
  }
}
