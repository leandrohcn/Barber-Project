import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  /**
   * Completar perfil do staff (criar funcionário associado)
   */
  async completeProfile(
    userId: string,
    organizationId: string,
    completeProfileDto: CompleteProfileDto,
  ) {
    // Obter dados do user
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verificar se já existe funcionário com este email
    const existingFuncionario = await this.prisma.funcionarios.findFirst({
      where: {
        organizationId,
        email: user.email,
      },
    });

    if (existingFuncionario) {
      throw new ConflictException(
        'Já existe um funcionário associado a este email',
      );
    }

    // Criar funcionário
    const funcionario = await this.prisma.funcionarios.create({
      data: {
        organizationId,
        name: completeProfileDto.name,
        email: user.email,
        phone: completeProfileDto.phone,
        isAtivo: true,
      },
    });

    return {
      message: 'Perfil completado com sucesso',
      funcionario: {
        id: funcionario.id,
        name: funcionario.name,
        email: funcionario.email,
        phone: funcionario.phone,
      },
    };
  }

  /**
   * Obter agendamentos do staff logado
   */
  async getStaffAgendamentos(userId: string, organizationId: string) {
    // Primeiro, encontrar o funcionario associado ao user
    const funcionario = await this.prisma.funcionarios.findFirst({
      where: {
        organizationId,
        email: (await this.prisma.users.findUnique({ where: { id: userId } }))
          ?.email,
      },
    });

    if (!funcionario) {
      throw new BadRequestException(
        'Usuário não tem um perfil de funcionário associado',
      );
    }

    // Buscar agendamentos do funcionário
    const agendamentos = await this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        funcionarioId: funcionario.id,
        deletedAt: null,
      },
      include: {
        catalogs: true,
        funcionarios: true,
        notificacoes: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return {
      total: agendamentos.length,
      agendamentos,
    };
  }

  /**
   * Obter dashboard do staff (métricas pessoais)
   */
  async getStaffDashboard(userId: string, organizationId: string) {
    // Encontrar o funcionario
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    const funcionario = await this.prisma.funcionarios.findFirst({
      where: {
        organizationId,
        email: user?.email,
      },
    });

    if (!funcionario) {
      throw new BadRequestException(
        'Usuário não tem um perfil de funcionário associado',
      );
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Agendamentos de hoje
    const agendamentosHoje = await this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        funcionarioId: funcionario.id,
        date: {
          gte: hoje,
          lt: amanha,
        },
        deletedAt: null,
      },
      include: {
        catalogs: true,
      },
    });

    // Agendamentos confirmados (última 30 dias)
    const dataUltimos30 = new Date();
    dataUltimos30.setDate(dataUltimos30.getDate() - 30);

    const agendamentosConfirmados = await this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        funcionarioId: funcionario.id,
        status: 'CONCLUIDO',
        date: {
          gte: dataUltimos30,
        },
        deletedAt: null,
      },
      include: {
        catalogs: true,
      },
    });

    // Calcular faturamento
    const faturamento = agendamentosConfirmados.reduce(
      (total, agendamento) => {
        return total + parseFloat(agendamento.catalogs.price.toString());
      },
      0,
    );

    // Total de clientes únicos
    const clientesUnicos = await this.prisma.agendamentos.findMany({
      where: {
        organizationId,
        funcionarioId: funcionario.id,
        deletedAt: null,
      },
      distinct: ['clienteEmail'],
      select: {
        clienteEmail: true,
      },
    });

    return {
      funcionario: {
        id: funcionario.id,
        name: funcionario.name,
        email: funcionario.email,
        phone: funcionario.phone,
      },
      metricas: {
        agendamentosHoje: agendamentosHoje.length,
        faturamentoUltimos30Dias: faturamento,
        clientesUnicos: clientesUnicos.length,
        agendamentosConfirmados: agendamentosConfirmados.length,
      },
      agendamentosHoje: agendamentosHoje.map((a) => ({
        id: a.id,
        clienteNome: a.clienteNome,
        clienteEmail: a.clienteEmail,
        clienteTelefone: a.clienteTelefone,
        service: a.catalogs.name,
        date: a.date,
        status: a.status,
      })),
    };
  }
}
