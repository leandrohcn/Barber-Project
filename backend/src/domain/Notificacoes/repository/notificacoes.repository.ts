import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { INotificacoesRepository } from './notificacoes.repository.interface';
import type { notificacoes } from '@prisma/client';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from '../dto/update-notificacao.dto';

@Injectable()
export class NotificacoesRepository implements INotificacoesRepository {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: CreateNotificacaoDto): Promise<notificacoes> {
    return this.prisma.notificacoes.create({
      data: {
        organizationId,
        agendamentoId: data.agendamentoId,
        tipo: data.tipo,
        mensagem: data.mensagem,
        destinatario: data.destinatario,
        status: 'PENDENTE',
      },
    });
  }

  async findAll(organizationId: string): Promise<notificacoes[]> {
    return this.prisma.notificacoes.findMany({
      where: {
        organizationId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnread(organizationId: string): Promise<notificacoes[]> {
    return this.prisma.notificacoes.findMany({
      where: {
        organizationId,
        status: 'PENDENTE',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUnread(organizationId: string): Promise<number> {
    return this.prisma.notificacoes.count({
      where: {
        organizationId,
        status: 'PENDENTE',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<notificacoes | null> {
    return this.prisma.notificacoes.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async markAsRead(organizationId: string, id: string): Promise<notificacoes> {
    return this.prisma.notificacoes.update({
      where: { id },
      data: { status: 'LIDO' },
    });
  }

  async markAllAsRead(organizationId: string): Promise<any> {
    return this.prisma.notificacoes.updateMany({
      where: {
        organizationId,
        status: 'PENDENTE',
      },
      data: { status: 'LIDO' },
    });
  }

  async delete(organizationId: string, id: string): Promise<notificacoes> {
    return this.prisma.notificacoes.delete({
      where: { id },
    });
  }
}
