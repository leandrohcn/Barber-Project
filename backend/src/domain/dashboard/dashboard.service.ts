import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
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

        agendamentosHoje.forEach((agendamento) => {

            if (agendamento.status === 'CANCELADO') {
                cancelamentos++;
            } else {
                const servico = agendamento.catalogo as Catalogo;
                faturamentoEsperado += servico.price;
                if (agendamento.status === 'CONCLUIDO') {
                    faturamentoReal += servico.price;
                }
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
