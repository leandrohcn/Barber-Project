import type { notificacoes as PrismaNotificacaoType } from '@prisma/client';
import type { TipoNotificacao, StatusNotificacao } from '@prisma/client';

export class Notificacao implements PrismaNotificacaoType {
  id: string;
  organizationId: string;
  agendamentoId: string;
  tipo: TipoNotificacao;
  status: StatusNotificacao;
  destinatario: string;
  mensagem: string;
  dataEnvio: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaNotificacaoType) {
    Object.assign(this, data);
  }
}