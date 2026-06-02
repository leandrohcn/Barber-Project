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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Catalogs')
@ApiBearerAuth()
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @GetOrganizationId() organizationId: string,
    @Body() createCatalogDto: CreateCatalogDto,
  ) {
    return this.catalogService.create(organizationId, createCatalogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetOrganizationId() organizationId: string) {
    return this.catalogService.findAll(organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  findOne(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.catalogService.findOne(organizationId, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  update(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
    @Body() updateCatalogDto: UpdateCatalogDto,
  ) {
    return this.catalogService.update(organizationId, id, updateCatalogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.catalogService.remove(organizationId, id);
  }
}
