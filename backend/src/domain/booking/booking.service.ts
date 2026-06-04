import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obter serviços públicos de uma organização
   */
  async getServices(organizationId: string) {
    const services = await this.prisma.catalogs.findMany({
      where: {
        organizationId,
        isAtivo: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        image: true,
        ordem: true,
      },
      orderBy: {
        ordem: 'asc',
      },
    });

    return {
      total: services.length,
      services,
    };
  }

  /**
   * Obter profissionais ativos de uma organização
   */
  async getProfessionals(organizationId: string) {
    const professionals = await this.prisma.funcionarios.findMany({
      where: {
        organizationId,
        isAtivo: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    return {
      total: professionals.length,
      professionals,
    };
  }

  /**
   * Criar agendamento (cliente anônimo)
   */
  async createBooking(createBookingDto: CreateBookingDto) {
    // Validar se a organização existe
    const organization = await this.prisma.organizations.findUnique({
      where: { id: createBookingDto.organizationId },
    });

    if (!organization) {
      throw new BadRequestException('Organização não encontrada');
    }

    // Validar se o serviço existe e está ativo
    const service = await this.prisma.catalogs.findFirst({
      where: {
        id: createBookingDto.catalogoId,
        organizationId: createBookingDto.organizationId,
        isAtivo: true,
        deletedAt: null,
      },
    });

    if (!service) {
      throw new BadRequestException('Serviço não encontrado ou inativo');
    }

    // Validar se o profissional existe e está ativo
    const professional = await this.prisma.funcionarios.findFirst({
      where: {
        id: createBookingDto.funcionarioId,
        organizationId: createBookingDto.organizationId,
        isAtivo: true,
        deletedAt: null,
      },
    });

    if (!professional) {
      throw new BadRequestException('Profissional não encontrado ou inativo');
    }

    // Validar se a data é no futuro
    const bookingDate = new Date(createBookingDto.date);
    if (bookingDate <= new Date()) {
      throw new BadRequestException('Data deve ser no futuro');
    }

    // Validar se o horário está disponível
    const existingBooking = await this.prisma.agendamentos.findFirst({
      where: {
        organizationId: createBookingDto.organizationId,
        funcionarioId: createBookingDto.funcionarioId,
        date: {
          gte: new Date(bookingDate.getTime() - 60000), // 1 minuto antes
          lte: new Date(
            bookingDate.getTime() + (service.duration || 30) * 60000,
          ),
        },
        status: {
          not: 'CANCELADO',
        },
        deletedAt: null,
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'Horário não disponível para este profissional',
      );
    }

    // Criar agendamento
    const agendamento = await this.prisma.agendamentos.create({
      data: {
        organizationId: createBookingDto.organizationId,
        clienteNome: createBookingDto.clienteNome,
        clienteEmail: createBookingDto.clienteEmail,
        clienteTelefone: createBookingDto.clienteTelefone,
        catalogoId: createBookingDto.catalogoId,
        funcionarioId: createBookingDto.funcionarioId,
        date: bookingDate,
        duration: service.duration,
        notas: createBookingDto.notas,
        status: 'PENDENTE',
      },
      include: {
        catalogs: true,
        funcionarios: true,
      },
    });

    return {
      message: 'Agendamento criado com sucesso',
      agendamento: {
        id: agendamento.id,
        clienteNome: agendamento.clienteNome,
        clienteEmail: agendamento.clienteEmail,
        clienteTelefone: agendamento.clienteTelefone,
        serviceName: agendamento.catalogs.name,
        profissionalName: agendamento.funcionarios?.name,
        date: agendamento.date,
        status: agendamento.status,
        notas: agendamento.notas,
      },
    };
  }
}
