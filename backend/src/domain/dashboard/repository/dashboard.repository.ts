import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IDashboardRepository } from './dashboard.repository.interface';

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  constructor(private prisma: PrismaService) {}

  async getMetricaDiaria(organizationId: string): Promise<{
    faturamentoEsperado: number;
    faturamentoReal: number;
    cancelamentos: number;
    agendamentos: number;
  }> {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const fimDia = new Date();
    fimDia.setHours(23, 59, 59, 999);

    const agendamentosHoje = await this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        date: {
          gte: inicioDia,
          lte: fimDia,
        },
        deletedAt: null,
      },
      include: {
        catalogs: true,
      },
    });

    let faturamentoEsperado = 0;
    let faturamentoReal = 0;
    let cancelamentos = 0;
    let agendamentos = agendamentosHoje.length;

    agendamentosHoje.forEach((appt) => {
      const preco = Number(appt.catalogs?.price) || 0;

      if (appt.status === 'CANCELADO' || appt.status === 'NAO_COMPARECEU') {
        cancelamentos++;
      } else if (appt.status === 'CONCLUIDO') {
        faturamentoReal += preco;
        faturamentoEsperado += preco;
      } else {
        faturamentoEsperado += preco;
      }
    });

    return {
      faturamentoEsperado,
      faturamentoReal,
      cancelamentos,
      agendamentos,
    };
  }
}
