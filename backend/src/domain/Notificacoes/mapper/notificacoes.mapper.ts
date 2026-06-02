import { Injectable } from '@nestjs/common';
import type { notificacoes } from '@prisma/client';

@Injectable()
export class NotificacoesMapper {
  toDomain(raw: any): notificacoes {
    return raw as notificacoes;
  }
}
