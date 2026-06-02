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
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Funcionarios')
@ApiBearerAuth()
@Controller('funcionarios')
@UseGuards(JwtAuthGuard)
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  /**
   * POST /funcionarios
   * Criar novo funcionário (requer autenticação)
   */
  @Post()
  create(
    @GetOrganizationId() organizationId: string,
    @Body() createFuncionarioDto: CreateFuncionarioDto,
  ) {
    return this.funcionariosService.create(organizationId, createFuncionarioDto);
  }

  /**
   * GET /funcionarios
   * Listar todos os funcionários da organização
   */
  @Get()
  findAll(@GetOrganizationId() organizationId: string) {
    return this.funcionariosService.findAll(organizationId);
  }

  /**
   * GET /funcionarios/ativos/lista
   * Listar apenas funcionários ativos (para clientes)
   */
  @Get('ativos/lista')
  findAllAtivos(@GetOrganizationId() organizationId: string) {
    return this.funcionariosService.findAllAtivos(organizationId);
  }

  /**
   * GET /funcionarios/:id
   * Buscar funcionário por ID
   */
  @Get(':id')
  @UseGuards(OrganizationGuard)
  findOne(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.funcionariosService.findOne(organizationId, id);
  }

  /**
   * PUT /funcionarios/:id
   * Atualizar funcionário
   */
  @Put(':id')
  @UseGuards(OrganizationGuard)
  update(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
    @Body() updateFuncionarioDto: UpdateFuncionarioDto,
  ) {
    return this.funcionariosService.update(organizationId, id, updateFuncionarioDto);
  }

  /**
   * POST /funcionarios/:id/deactivate
   * Desativar funcionário
   */
  @Post(':id/deactivate')
  @UseGuards(OrganizationGuard)
  deactivate(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.funcionariosService.deactivate(organizationId, id);
  }

  /**
   * DELETE /funcionarios/:id
   * Deletar funcionário (soft delete)
   */
  @Delete(':id')
  @UseGuards(OrganizationGuard)
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.funcionariosService.remove(organizationId, id);
  }
}
