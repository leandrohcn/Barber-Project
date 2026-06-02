import type { horarios_funcionamento as PrismaHorarioType } from '@prisma/client';

export class HorarioFuncionamento implements PrismaHorarioType {
  id: string;
  organizationId: string;
  funcionarioId: string | null;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  estaAtivo: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: PrismaHorarioType) {
    Object.assign(this, data);
  }
}
