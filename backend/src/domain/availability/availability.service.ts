import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';


@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obter horários disponíveis para um funcionário em uma data específica
   */
  async getAvailability(
    funcionarioId: string,
    dateStr: string,
    organizationId: string,
  ) {
    // Validar data
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Data inválida. Use formato YYYY-MM-DD');
    }

    // Obter funcionário
    const funcionario = await this.prisma.funcionarios.findUnique({
      where: { id: funcionarioId },
    });

    if (!funcionario || funcionario.organizationId !== organizationId) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    if (!funcionario.isAtivo) {
      throw new BadRequestException('Funcionário inativo');
    }

    // Obter horários de funcionamento do funcionário para o dia da semana
    const diaSemana = date.getDay(); // 0 = domingo, 1 = segunda, etc

    const horariosTrabalho =
      await this.prisma.horarios_funcionamento.findMany({
        where: {
          organizationId,
          funcionarioId,
          diaSemana,
          estaAtivo: true,
        },
      });

    if (horariosTrabalho.length === 0) {
      return {
        date: dateStr,
        disponivel: false,
        mensagem: 'Funcionário não trabalha neste dia',
        slots: [],
      };
    }

    // Obter agendamentos já marcados para o funcionário nesta data
    const dataInicio = new Date(date);
    dataInicio.setHours(0, 0, 0, 0);

    const dataFim = new Date(date);
    dataFim.setHours(23, 59, 59, 999);

    const agendamentosOcupados = await this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        funcionarioId,
        date: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: {
          not: 'CANCELADO', // Ignora agendamentos cancelados
        },
        deletedAt: null,
      },
      include: {
        catalogs: true,
      },
    });

    // Gerar slots disponíveis
    const slots = this.gerarSlots(
      date,
      horariosTrabalho,
      agendamentosOcupados,
    );

    return {
      date: dateStr,
      funcionario: {
        id: funcionario.id,
        name: funcionario.name,
      },
      horarioTrabalho: horariosTrabalho.map((h) => ({
        horaInicio: h.horaInicio,
        horaFim: h.horaFim,
      })),
      slots: slots.filter((s) => s.disponivel),
      slotsOcupados: slots.filter((s) => !s.disponivel),
      totalDisponivel: slots.filter((s) => s.disponivel).length,
    };
  }

  /**
   * Gerar slots de 30 minutos com informação de disponibilidade
   */
  private gerarSlots(
    date: Date,
    horariosTrabalho: any[],
    agendamentosOcupados: any[],
  ) {
    const slots: any[] = [];
    const duracao = 30; // 30 minutos por slot

    for (const horario of horariosTrabalho) {
      const [horaInicio, minutoInicio] = horario.horaInicio.split(':').map(Number);
      const [horaFim, minutoFim] = horario.horaFim.split(':').map(Number);

      let horaAtual = horaInicio;
      let minutoAtual = minutoInicio;

      while (horaAtual < horaFim || (horaAtual === horaFim && minutoAtual < minutoFim)) {
        const slotData = new Date(date);
        slotData.setHours(horaAtual, minutoAtual, 0, 0);

        const slotFim = new Date(slotData);
        slotFim.setMinutes(slotFim.getMinutes() + duracao);

        // Verificar se há agendamento ocupando este slot
        const ocupado = agendamentosOcupados.some((agendamento) => {
          const agendamentoInicio = new Date(agendamento.date);
          const agendamentoFim = new Date(agendamento.date);
          agendamentoFim.setMinutes(
            agendamentoFim.getMinutes() + (agendamento.catalogs.duration || 30),
          );

          // Verifica se os horários se sobrepõem
          return slotData < agendamentoFim && slotFim > agendamentoInicio;
        });

        slots.push({
          horario: `${String(horaAtual).padStart(2, '0')}:${String(minutoAtual).padStart(2, '0')}`,
          timestamp: slotData.toISOString(),
          disponivel: !ocupado,
        });

        // Próximo slot
        minutoAtual += duracao;
        if (minutoAtual >= 60) {
          horaAtual += Math.floor(minutoAtual / 60);
          minutoAtual = minutoAtual % 60;
        }
      }
    }

    return slots;
  }
}
