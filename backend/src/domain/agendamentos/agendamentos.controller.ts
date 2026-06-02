import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Agendamentos')
@ApiBearerAuth()
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  /**
   * POST /agendamentos
   * Criar novo agendamento
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @GetOrganizationId() organizationId: string,
    @Body() createAgendamentoDto: CreateAgendamentoDto,
  ) {
    return this.agendamentosService.create(organizationId, createAgendamentoDto);
  }

  /**
   * GET /agendamentos
   * Listar todos os agendamentos da organização
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetOrganizationId() organizationId: string) {
    return this.agendamentosService.findAll(organizationId);
  }

  /**
   * GET /agendamentos/:id
   * Buscar agendamento por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  findOne(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.agendamentosService.findOne(organizationId, id);
  }

  /**
   * PUT /agendamentos/:id
   * Atualizar agendamento
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  update(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
  ) {
    return this.agendamentosService.update(
      organizationId,
      id,
      updateAgendamentoDto,
    );
  }

  /**
   * DELETE /agendamentos/:id
   * Deletar agendamento (soft delete)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.agendamentosService.remove(organizationId, id);
  }
}
