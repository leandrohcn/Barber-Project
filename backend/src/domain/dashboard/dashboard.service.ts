import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Catalogo } from '../Catalogo/entities/catalog.entity';

@Injectable()
export class DashboardService {
    constructor(private readonly prismaService: PrismaService) {   
    }

    async getMetricaDiaria() {
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date();
        fimDia.setHours(23, 59, 59, 999);

        const agendamentosHoje = await this.prismaService.agendamentos.findMany({
            where: {
                date: {
                    gte: inicioDia,
                    lte: fimDia,
                },
            },
            include: {
                catalogo: true,
            },
        });
        let faturamentoEsperado = 0;
        let faturamentoReal = 0;
        let cancelamentos = 0;
        let agendamentos = agendamentosHoje.length;

        agendamentosHoje.forEach((appt) => {
        const preco = Number(appt.catalogo?.price) || 0;

        // Status em PORTUGUÊS agora:
        if (appt.status === 'CANCELADO') {
          cancelamentos++;
        } 
        // Se estiver FINALIZADO (Dinheiro no bolso)
        else if (appt.status === 'FINALIZADO') {
          faturamentoReal += preco;
          faturamentoEsperado += preco;
        } 
        // Se for SOLICITADO ou CONFIRMADO (Ainda vai acontecer)
        else {
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
