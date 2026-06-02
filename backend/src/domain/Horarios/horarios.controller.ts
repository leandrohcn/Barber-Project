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
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Horarios')
@ApiBearerAuth()
@Controller('horarios')
@UseGuards(JwtAuthGuard)
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  /**
   * POST /horarios
   * Criar novo horário para funcionário
   */
  @Post()
  create(
    @GetOrganizationId() organizationId: string,
    @Body() createHorarioDto: CreateHorarioDto,
  ) {
    return this.horariosService.create(organizationId, createHorarioDto);
  }

  /**
   * GET /horarios
   * Listar todos os horários da organização
   */
  @Get()
  findAll(@GetOrganizationId() organizationId: string) {
    return this.horariosService.findAll(organizationId);
  }

  /**
   * GET /horarios/funcionario/:funcionarioId
   * Buscar horários de um funcionário específico
   */
  @Get('funcionario/:funcionarioId')
  findByFuncionario(
    @GetOrganizationId() organizationId: string,
    @Param('funcionarioId') funcionarioId: string,
  ) {
    return this.horariosService.findByFuncionario(organizationId, funcionarioId);
  }

  /**
   * GET /horarios/:id
   * Buscar horário por ID
   */
  @Get(':id')
  @UseGuards(OrganizationGuard)
  findOne(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.horariosService.findOne(organizationId, id);
  }

  /**
   * PUT /horarios/:id
   * Atualizar horário
   */
  @Put(':id')
  @UseGuards(OrganizationGuard)
  update(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
    @Body() updateHorarioDto: UpdateHorarioDto,
  ) {
    return this.horariosService.update(organizationId, id, updateHorarioDto);
  }

  /**
   * DELETE /horarios/:id
   * Deletar horário (soft delete)
   */
  @Delete(':id')
  @UseGuards(OrganizationGuard)
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.horariosService.remove(organizationId, id);
  }
}
