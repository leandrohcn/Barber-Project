import type { agendamentos } from '@prisma/client';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';

export interface IAgendamentosRepository {
  create(organizationId: string, data: CreateAgendamentoDto): Promise<agendamentos>;
  findAll(organizationId: string): Promise<agendamentos[]>;
  findOne(organizationId: string, id: string): Promise<agendamentos | null>;
  update(organizationId: string, id: string, data: UpdateAgendamentoDto): Promise<agendamentos>;
  delete(organizationId: string, id: string): Promise<agendamentos>;
}
