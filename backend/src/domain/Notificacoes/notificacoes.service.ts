import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';
import type { notificacoes } from '@prisma/client';
import type { INotificacoesRepository } from './repository/notificacoes.repository.interface';


@Injectable()
export class NotificacoesService {
  constructor(
    @Inject('INotificacoesRepository') private notificacoesRepository: INotificacoesRepository,
  ) {}

  /**
   * Criar nova notificação
   * ✅ Valida organizationId
   * ✅ Valida que agendamento pertence à organização
   */
  async create(organizationId: string, createNotificacaoDto: CreateNotificacaoDto): Promise<notificacoes> {
    return this.notificacoesRepository.create(organizationId, createNotificacaoDto);
  }

  /**
   * Listar notificações da organização
   * ✅ Filtra por organizationId
   */
  async findAll(organizationId: string): Promise<notificacoes[]> {
    return this.notificacoesRepository.findAll(organizationId);
  }

  /**
   * Listar notificações não lidas
   */
  async findUnread(organizationId: string): Promise<notificacoes[]> {
    return this.notificacoesRepository.findUnread(organizationId);
  }

  /**
   * Buscar notificação por ID
   * ✅ Valida isolamento
   */
  async findOne(organizationId: string, id: string): Promise<notificacoes> {
    const notificacao = await this.notificacoesRepository.findOne(organizationId, id);

    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notificacao.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta notificação',
      );
    }

    return notificacao;
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(organizationId: string, id: string): Promise<notificacoes> {
    await this.findOne(organizationId, id);

    return this.notificacoesRepository.markAsRead(organizationId, id);
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(organizationId: string): Promise<{ count: number }> {
    return this.notificacoesRepository.markAllAsRead(organizationId);
  }

  /**
   * Deletar notificação
   */
  async remove(organizationId: string, id: string): Promise<notificacoes> {
    await this.findOne(organizationId, id);

    return this.notificacoesRepository.delete(organizationId, id);
  }

  /**
   * Contar notificações não lidas
   */
  async countUnread(organizationId: string): Promise<number> {
    return this.notificacoesRepository.countUnread(organizationId);
  }
}
