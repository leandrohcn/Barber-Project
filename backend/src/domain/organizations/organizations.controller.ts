import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  /**
   * POST /organizations
   * Criar nova organização (barbearia)
   */
  @Post()
  create(@Body() createOrgDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrgDto);
  }

  /**
   * GET /organizations/:subdomain
   * Buscar organização por subdomain (público - usado no frontend)
   */
  @Get('subdomain/:subdomain')
  findBySubdomain(@Param('subdomain') subdomain: string) {
    return this.organizationsService.findBySubdomain(subdomain);
  }

  /**
   * GET /organizations/:slug
   * Buscar organização por slug (público)
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.organizationsService.findBySlug(slug);
  }

  /**
   * GET /organizations/:id
   * Buscar organização por ID (requer autenticação)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  findById(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  /**
   * GET /organizations/:organizationId/stats
   * Obter estatísticas da organização
   */
  @Get(':organizationId/stats')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  getStats(@Param('organizationId') organizationId: string) {
    return this.organizationsService.getStats(organizationId);
  }

  /**
   * PUT /organizations/:id
   * Atualizar organização (requer autenticação e permissão)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrgDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrgDto);
  }

  /**
   * DELETE /organizations/:id
   * Deletar organização (soft delete - requer autenticação)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  remove(@Param('id') id: string) {
    return this.organizationsService.softDelete(id);
  }

  /**
   * GET /organizations
   * Listar todas as organizações (apenas admin)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.organizationsService.findAll();
  }
}
