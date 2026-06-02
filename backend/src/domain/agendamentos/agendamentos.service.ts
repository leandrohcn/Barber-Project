import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import type { agendamentos } from '@prisma/client';
import type { IAgendamentosRepository } from './repository/agendamentos.repository.interface';


@Injectable()
export class AgendamentosService {
  constructor(
    @Inject('IAgendamentosRepository') private agendamentosRepository: IAgendamentosRepository
  ) {}

  /**
   * Criar novo agendamento
   * ✅ Multi-tenant: Cria para organizationId específico
   */
  async create(
    organizationId: string,
    createAgendamentoDto: CreateAgendamentoDto,
  ): Promise<agendamentos> {
    return this.agendamentosRepository.create(organizationId, createAgendamentoDto);
  }

  /**
   * Listar agendamentos da organização
   * ✅ Filtra por organizationId
   */
  async findAll(organizationId: string): Promise<agendamentos[]> {
    return this.agendamentosRepository.findAll(organizationId);
  }

  /**
   * Buscar agendamento por ID
   * ✅ Valida isolamento
   */
  async findOne(organizationId: string, id: string): Promise<agendamentos> {
    const agendamento = await this.agendamentosRepository.findOne(organizationId, id);

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (agendamento.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este agendamento',
      );
    }

    return agendamento;
  }

  /**
   * Atualizar agendamento
   * ✅ Valida isolamento
   */
  async update(
    organizationId: string,
    id: string,
    updateAgendamentoDto: UpdateAgendamentoDto,
  ): Promise<agendamentos> {
    await this.findOne(organizationId, id);

    return this.agendamentosRepository.update(organizationId, id, updateAgendamentoDto);
  }

  /**
   * Deletar agendamento (soft delete)
   * ✅ Valida isolamento
   */
  async remove(organizationId: string, id: string): Promise<agendamentos> {
    await this.findOne(organizationId, id);

    return this.agendamentosRepository.delete(organizationId, id);
  }
}
