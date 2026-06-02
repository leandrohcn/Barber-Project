import { Injectable } from '@nestjs/common';
import type { agendamentos } from '@prisma/client';

@Injectable()
export class AgendamentosMapper {
  toDomain(raw: any): agendamentos {
    return raw as agendamentos;
  }

  toResponse(agendamento: agendamentos): agendamentos {
    return agendamento;
  }
}
