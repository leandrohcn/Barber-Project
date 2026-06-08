import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/db/prisma.service';

import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';
import type { Request } from 'express';

@ApiTags('Horarios')
@ApiBearerAuth()
@Controller('horarios')
@UseGuards(JwtAuthGuard)
export class HorariosController {
  constructor(
    private readonly horariosService: HorariosService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * GET /horarios/me
   * Buscar funcionarioId e horários do staff logado (usando email)
   */
  @Get('me/staff')
  async getMeAsStaff(
    @GetOrganizationId() organizationId: string,
    @Req() req: Request,
  ) {
    try {
      const userEmail = (req.user as any)?.email;

      if (!userEmail) {
        return { funcionarioId: null, horarios: [] };
      }

      console.log('[getMeAsStaff] Buscando funcionário com email:', userEmail, 'organizationId:', organizationId);

      // Buscar funcionário por email e organizationId
      const funcionario = await this.prisma.funcionarios.findFirst({
        where: {
          organizationId,
          email: userEmail,
        },
      });

      console.log('[getMeAsStaff] Funcionário encontrado:', funcionario?.id);

      if (!funcionario) {
        return { funcionarioId: null, horarios: [] };
      }

      // Buscar seus horários
      const horarios = await this.horariosService.findByFuncionario(
        organizationId,
        funcionario.id,
      );

      return {
        funcionarioId: funcionario.id,
        horarios,
      };
    } catch (error) {
      console.error('[getMeAsStaff] Erro:', error);
      throw error;
    }
  }

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
   * POST /horarios/upsert
   * Criar ou atualizar horário (upsert por funcionarioId + diaSemana)
   */
  @Post('upsert/batch')
  async upsertBatch(
    @GetOrganizationId() organizationId: string,
    @Body() body: { funcionarioId: string; horarios: CreateHorarioDto[] },
  ) {
    const results: any[] = [];
    for (const horario of body.horarios) {
      try {
        // Tentar buscar o horário existente
        const existente = await (this.prisma as any).horarios_funcionamento.findFirst({
          where: {
            funcionarioId: body.funcionarioId,
            diaSemana: horario.diaSemana,
          },
        });

        if (existente) {
          // Atualizar
          const updated = await this.horariosService.update(
            organizationId,
            existente.id,
            horario,
          );
          results.push(updated);
        } else {
          // Criar
          const created = await this.horariosService.create(organizationId, horario);
          results.push(created);
        }
      } catch (error) {
        console.error('Erro ao salvar horário:', error);
      }
    }
    return results;
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
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.horariosService.remove(organizationId, id);
  }
}
