import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IHorariosRepository } from './horarios.repository.interface';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';

@Injectable()
export class HorariosRepository implements IHorariosRepository {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: CreateHorarioDto): Promise<any> {
    return (this.prisma as any).horarios_funcionamento.create({
      data: {
        organizationId,
        funcionarioId: data.funcionarioId,
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio,
        horaFim: data.horaFim,
        estaAtivo: true,
      },
    });
  }

  async findAll(organizationId: string): Promise<any[]> {
    return (this.prisma as any).horarios_funcionamento.findMany({
      where: {
        organizationId,
      },
      orderBy: { diaSemana: 'asc' },
    });
  }

  async findByFuncionario(organizationId: string, funcionarioId: string): Promise<any[]> {
    return (this.prisma as any).horarios_funcionamento.findMany({
      where: {
        organizationId,
        funcionarioId,
      },
      orderBy: { diaSemana: 'asc' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<any | null> {
    return (this.prisma as any).horarios_funcionamento.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async update(organizationId: string, id: string, data: UpdateHorarioDto): Promise<any> {
    return (this.prisma as any).horarios_funcionamento.update({
      where: { id },
      data,
    });
  }

  async delete(organizationId: string, id: string): Promise<any> {
    return (this.prisma as any).horarios_funcionamento.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  async count(organizationId: string): Promise<number> {
    return (this.prisma as any).horarios_funcionamento.count({
      where: {
        organizationId,
      },
    });
  }
}
