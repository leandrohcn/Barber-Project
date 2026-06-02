import type { notificacoes } from '@prisma/client';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from '../dto/update-notificacao.dto';

export interface INotificacoesRepository {
  create(organizationId: string, data: CreateNotificacaoDto): Promise<notificacoes>;
  findAll(organizationId: string): Promise<notificacoes[]>;
  findUnread(organizationId: string): Promise<notificacoes[]>;
  countUnread(organizationId: string): Promise<number>;
  findOne(organizationId: string, id: string): Promise<notificacoes | null>;
  markAsRead(organizationId: string, id: string): Promise<notificacoes>;
  markAllAsRead(organizationId: string): Promise<any>;
  delete(organizationId: string, id: string): Promise<notificacoes>;
}
