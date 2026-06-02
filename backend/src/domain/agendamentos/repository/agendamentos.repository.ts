import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/db/prisma.service';
import { IAgendamentosRepository } from './agendamentos.repository.interface';
import type { agendamentos } from '@prisma/client';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';

@Injectable()
export class AgendamentosRepository implements IAgendamentosRepository {
  constructor(private prisma: PrismaService) { }

  async create(organizationId: string, data: CreateAgendamentoDto): Promise<agendamentos> {
    return this.prisma.agendamentos.create({
      data: {
        organizationId,
        clienteNome: data.clienteNome,
        clienteEmail: data.clienteEmail,
        clienteTelefone: data.clienteTelefone,
        catalogoId: data.catalogoId,
        funcionarioId: data.funcionarioId,
        date: new Date(data.date),
        duration: data.duration,
        notas: data.notas,
        updatedAt: new Date(),
      },
      include: { catalogs: true },
    });
  }

  async findAll(organizationId: string): Promise<agendamentos[]> {
    return this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: { catalogs: true, funcionarios: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<agendamentos | null> {
    return this.prisma.agendamentos.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: { catalogs: true, funcionarios: true },
    });
  }

  async update(organizationId: string, id: string, data: UpdateAgendamentoDto): Promise<agendamentos> {
    return this.prisma.agendamentos.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: { catalogs: true },
    });
  }

  async delete(organizationId: string, id: string): Promise<agendamentos> {
    return this.prisma.agendamentos.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
